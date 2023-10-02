import {ActivitiesRepository} from "../datalayer/Activities.repository";
import {Layout, PlotData} from 'plotly.js';
import {GetTopQueriesResponse, QueryMetadata, Trace} from "../proto/activities.pb";
import {MetricValues} from "../proto/shared.pb";
import {emptyLayout} from "./utils";
import dayjs from "dayjs";
import {convertToLocalTime, convertToUTCTime} from "../../CoreModules/timeIntervals";

export interface ChartObject {
    traces: PlotData[];
    layout: Layout;
}

// load by wait events (Average Active Session)
export interface AAS {
    layout: Layout,
    data: PlotData[]
    total: number
    upperRange: number
}

export interface TableData {
    aas: AAS
    name: string
    fingerprint: string
    isNotExplainable: boolean
    isTruncated: boolean
    parameters: string[]
    query_sha?: string
}

export interface TopQueriesTableData extends TableData {
    num_queries?: MetricValues
    query_time?: MetricValues
    query_time_per_call?: MetricValues
    shared_blks_read?: MetricValues
    shared_blks_dirtied?: MetricValues
    shared_blks_hit?: MetricValues
    shared_blks_written?: MetricValues
    rows_sent?: MetricValues
    local_blks_hit?: MetricValues
    local_blks_read?: MetricValues
    local_blks_dirtied?: MetricValues
    local_blks_written?: MetricValues
    temp_blks_read?: MetricValues
    temp_blks_written?: MetricValues
    blk_read_time?: MetricValues
    blk_write_time?: MetricValues
}

export interface TopQueriesByFingerprintTableData extends TableData {
}

export interface QueryDetailsType {
    layout: Layout
    data: PlotData[]
}

interface GetProfileArgs {
    from: any;
    to: any;
    clusterName: string;
}

interface QueriesArgs {
    from: any;
    to: any;
    clusterName: string;
    fingerprint?: string;
}

export class ActivitiesService {
    private activitiesRepository: ActivitiesRepository;

    constructor(activitiesRepository: ActivitiesRepository) {
        this.activitiesRepository = activitiesRepository
    }

    async getProfile(args: GetProfileArgs): Promise<ChartObject> {
        const response = await this.activitiesRepository.getProfile({
            period_start_to: convertToUTCTime(args.to),
            period_start_from: convertToUTCTime(args.from),
            cluster_name: args.clusterName,
        });

        if (Object.keys(response).length === 0) {
            return {
                layout: emptyLayout(args.from, args.to),
                traces: []
            }
        }

        const traces: PlotData[] = [];

        // Convert the timestamps to local time, since every trace is always present we pick one
        // and convert it instead of converting everyone
        const timeZonedTimestamps = response
            .traces["CPU"]
            .x_values_timestamp
            .map(value => convertToLocalTime(value.toString()))

        for (const traceKey of Object.keys(response.traces || {})) {
            const trace = response.traces![traceKey];

            traces.push({
                x: trace.x_values_timestamp
                    ? timeZonedTimestamps
                    : [],
                y: trace.y_values_float ? trace.y_values_float : [],
                name: traceKey,
                hoverinfo: this.hideZeroValuesFromHoverbox(trace),
                showlegend: this.hideZeroYValuesTraceFromLegend(trace),
                type: 'bar',
                marker: {
                    line: {
                        color: 'grey',
                        width: 0,
                    },
                    color: trace.color,
                },
                opacity: 0.9,
            } as PlotData);
        }

        const layout: Layout = {
            barmode: 'stack',
            yaxis: {
                fixedrange: true,
            },
            xaxis: {
                range: [
                    args.from,
                    args.to,
                ],
                type: 'date',
            },
            hovermode: 'x unified',
            shapes: [
                {
                    name: 'vCPU',
                    type: 'line',
                    xref: 'paper',
                    x0: 0,
                    y0: response.current_cpu_cores,
                    x1: 1,
                    y1: response.current_cpu_cores,
                    line: {
                        color: 'rgb(255, 0, 0)',
                        width: 2,
                        dash: 'dot',
                    },
                },
            ],
        } as Layout;

        return {
            traces, layout,
        };
    }

    async getTopQueries(args: QueriesArgs): Promise<readonly TopQueriesTableData[]> {
        const response = await this.activitiesRepository.getTopQueries({
            period_start_from: args.from,
            period_start_to: args.to,
            cluster_name: args.clusterName,
        });

        if (Object.keys(response).length === 0) {
            return undefined
        }

        return this.processDataAndLayout(response);
    }

    async getTopQueriesByFingerprint(args: QueriesArgs): Promise<TopQueriesByFingerprintTableData[]> {
        const response = await this.activitiesRepository.getTopQueriesByFingerprint({
            period_start_from: args.from,
            period_start_to: args.to,
            cluster_name: args.clusterName,
            fingerprint: args.fingerprint
        });

        if (Object.keys(response).length === 0) {
            return undefined
        }

        const tableDataArray: TopQueriesByFingerprintTableData[] = [];

        for (const traceKey of Object.keys(response.traces || {})) {
            const trace = response.traces![traceKey];
            const totalLoad = response.query_metrics.metrics["cpu_total_load"].sum

            for (let i = 0; i < trace.y_values_float!.length; i++) {
                const data = tableDataArray[i];
                const querySha = trace.x_values_string![i]
                const metadata = response.queries_metadata[querySha];
                const {text: queryText, parameters, fingerprint}: QueryMetadata = metadata

                if (data) {
                    tableDataArray[i].aas.data.push(this.getTraceFromTemplate(trace, queryText, i, traceKey));
                } else {
                    tableDataArray.push({
                        name: metadata.is_query_truncated ? queryText + '...' : queryText,
                        aas: {
                            layout: {},
                            data: [this.getTraceFromTemplate(trace, queryText, i, traceKey)],
                            total: totalLoad
                        },
                        isNotExplainable: metadata.is_query_not_explainable,
                        isTruncated: metadata.is_query_truncated,
                        fingerprint: fingerprint,
                        parameters: parameters,
                        query_sha: querySha,
                    } as TopQueriesByFingerprintTableData);
                }
            }
        }
        this.setTopQueriesLayout(tableDataArray);

        return tableDataArray;
    }

    async getQueryDetails(args: QueriesArgs): Promise<QueryDetailsType> {
        const response = await this.activitiesRepository.getQueryDetails({
            period_start_from: args.from,
            period_start_to: args.to,
            cluster_name: args.clusterName,
            query_fingerprint: args.fingerprint
        });

        let metrics: PlotData[] = [];

        // Convert the timestamps to local time, since every trace is always present we pick one
        // and convert it instead of converting everyone
        const timeZonedTimestamps = response
            .traces["num_queries"]
            .x_values_timestamp
            .map(value => convertToLocalTime(value.toString()))

        let i = 0;
        for (const metricKey of Object.keys(response.traces || {})) {
            const trace = response.traces![metricKey];
            i++

            metrics.push({
                x: timeZonedTimestamps,
                y: trace.y_values_float,
                name: metricKey,
                type: 'scatter',
                mode: "lines",
                line: {color: this.pastelColors()},
            } as PlotData)
        }

        metrics = metrics.sort((a, b) => {
            return Math.max(...a.y as number[]) - Math.max(...b.y as number[])
        }).map((a, i) => ({
            ...a,
            yaxis: 'y' + i,
        }))

        // TODO unified hover:
        // - https://stackoverflow.com/questions/73428753/plotly-how-to-display-y-values-when-hovering-on-two-subplots-sharing-x-axis
        // - https://codepen.io/suribabu_95/pen/wpBBEx?editors=1011
        // - https://plotly.com/javascript/hover-events/#coupled-hover-events
        const layout = {
            height: 1200,
            hovermode: 'x unified',
            xaxis: {
                range: [
                    args.from,
                    args.to,
                ],
                type: 'date',
            },
            legend: {traceorder: 'reversed'}
        } as Layout

        metrics.forEach((metric, i) => {
            layout["yaxis" + (i + 1)] = {domain: [i / metrics.length, (i + 1) / metrics.length]}
        })

        return {
            layout,
            data: metrics
        }
    }

    private setTopQueriesLayout(tableDataArray: TopQueriesByFingerprintTableData[] | TopQueriesTableData[]) {
        const highestRankedSQL: TopQueriesByFingerprintTableData = tableDataArray[0];
        const highestTotal = highestRankedSQL.aas.total;

        for (let i = 0; i < tableDataArray.length; i++) {
            const total = tableDataArray[i].aas.total;
            const upperRange = Math.round(((total * 100) / highestTotal));

            if (upperRange === 0) {
                tableDataArray[i].aas.layout = this.getLayoutFromTemplate();
                tableDataArray[i].aas.upperRange = 1

            } else {
                tableDataArray[i].aas.layout = this.getLayoutFromTemplate();
                tableDataArray[i].aas.upperRange = upperRange
            }
        }
    }

    private processDataAndLayout(response: GetTopQueriesResponse): TopQueriesTableData[] {
        const tableDataArray: TopQueriesTableData[] = [];

        for (const traceKey of Object.keys(response.traces || {})) {
            const trace = response.traces![traceKey];

            for (let i = 0; i < trace.y_values_float!.length; i++) {
                const data = tableDataArray[i];
                const fingerprint = trace.x_values_string![i]
                const metadata = response.queries_metadata[fingerprint];
                const {text: queryText, parameters}: QueryMetadata = metadata
                const totalLoad = response.queries_metrics[fingerprint].metrics["cpu_total_load"].sum

                if (data) {
                    tableDataArray[i].aas.data.push(this.getTraceFromTemplate(trace, queryText, i, traceKey));
                } else {
                    tableDataArray.push({
                        name: metadata.is_query_truncated ? queryText + '...' : queryText,
                        aas: {
                            layout: {},
                            data: [this.getTraceFromTemplate(trace, queryText, i, traceKey)],
                            total: totalLoad
                        },
                        isNotExplainable: metadata.is_query_not_explainable,
                        isTruncated: metadata.is_query_truncated,
                        fingerprint: fingerprint,
                        parameters: parameters
                    } as TopQueriesTableData);
                }
            }
        }

        this.setTopQueriesLayout(tableDataArray)

        for (let i = 0; i < tableDataArray.length; i++) {
            const id = tableDataArray[i].fingerprint;
            if (response.queries_metrics) {
                const metrics = response.queries_metrics[id].metrics
                for (const metricsKey in metrics) {
                    tableDataArray[i][metricsKey] = metrics[metricsKey]
                }
            }
        }

        return tableDataArray;
    }

    private getLayoutFromTemplate = (): Layout => ({
        autosize: true,
        height: 20,
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0,
            pad: 0,
        },
        showlegend: false,
        barmode: 'stack',
        hovermode: 'y unified',
        xaxis: {
            showgrid: false,
            zeroline: false,
            visible: false,
            fixedrange: true,
            // domain,
        },
        yaxis: {
            showgrid: false,
            zeroline: false,
            visible: false,
            fixedrange: true,
        },
    } as Layout);

    private getTraceFromTemplate = (trace: Trace, queryText: string, i: number, name: string): PlotData => ({
        x: [trace.y_values_float![i]],
        y: [queryText],
        name: name,
        type: 'bar',
        orientation: 'h',
        hoverinfo: 'none',
        width: 1,
        marker: {
            line: {
                color: 'grey',
                width: 0,
            },
            color: trace.color,
        },
        opacity: 0.9,
    } as PlotData);

    private hideZeroYValuesTraceFromLegend(trace: Trace): boolean {
        return trace.y_values_float?.reduce((a, b) => a + b, 0) !== 0;
    }

    private hideZeroValuesFromHoverbox(trace: Trace): 'none' | 'y+name' {
        return trace.y_values_float?.map(val => val === 0 ? 'none' : 'y+name') as unknown as 'none' | 'y+name';
    }

    private pastelColors(): string {
        const r = (Math.round(Math.random() * 127) + 127).toString(16);
        const g = (Math.round(Math.random() * 127) + 127).toString(16);
        const b = (Math.round(Math.random() * 127) + 127).toString(16);
        return '#' + r + g + b;
    }
}