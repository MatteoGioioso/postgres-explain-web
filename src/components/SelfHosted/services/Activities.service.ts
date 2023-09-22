import {ActivitiesRepository} from "../datalayer/Activities.repository";
import {Layout, PlotData} from 'plotly.js';
import {GetTopQueriesResponse, Trace} from "../proto/activities.pb";
import {MetricValues} from "../proto/shared.pb";

export interface ChartObject {
    traces: PlotData[];
    layout: Layout;
}

export interface AAS {
    layout: any,
    data: PlotData[]
}

export interface TableData {
    aas: AAS
    name: string
    id: string
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

interface GetProfileArgs {
    from: any;
    to: any;
    clusterName: string;
}

interface GetTopQueriesArgs {
    from: any;
    to: any;
    clusterName: string;
}

export class ActivitiesService {
    private activitiesRepository: ActivitiesRepository;

    constructor(activitiesRepository: ActivitiesRepository) {
        this.activitiesRepository = activitiesRepository
    }

    async getProfile(args: GetProfileArgs): Promise<ChartObject> {
        const response = await this.activitiesRepository.getProfile({
            period_start_to: args.to,
            period_start_from: args.from,
            cluster_name: args.clusterName,
        });

        const traces: PlotData[] = [];

        for (const traceKey of Object.keys(response.traces || {})) {
            const trace = response.traces![traceKey];

            // @ts-ignore
            traces.push({
                x: trace.x_values_timestamp ? trace.x_values_timestamp : [],
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
            });
        }

        // @ts-ignore
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
        };

        return {
            traces, layout,
        };
    }

    async getTopQueries(args: GetTopQueriesArgs): Promise<readonly TopQueriesTableData[]> {
        const topSQLReply = await this.activitiesRepository.getTopQueries({
            period_start_from: args.from,
            period_start_to: args.to,
            cluster_name: args.clusterName,
        });

        return this.processDataAndLayout(topSQLReply);
    }

    private processDataAndLayout(response: GetTopQueriesResponse): TopQueriesTableData[] {
        const tableDataArray: TopQueriesTableData[] = [];

        for (const traceKey of Object.keys(response.traces || {})) {
            const trace = response.traces![traceKey];

            for (let i = 0; i < trace.y_values_float!.length; i++) {
                const d = tableDataArray[i];

                if (d) {
                    tableDataArray[i].aas.data.push(this.getTraceFromTemplate(trace, i, traceKey));
                } else {
                    tableDataArray.push({
                        name: trace.x_values_string![i],
                        aas: {
                            layout: {},
                            data: [this.getTraceFromTemplate(trace, i, traceKey)],
                        },
                        id: trace.x_values_metadata["fingerprint"].meta[i]
                    });
                }
            }
        }

        const highestRankedSQL: TableData = tableDataArray[0];
        const highestTotal = this.getTotal(highestRankedSQL);
        const SCALE_DOWN_FACTOR = 1.2;

        for (let i = 0; i < tableDataArray.length; i++) {
            const total = this.getTotal(tableDataArray[i]);
            const upperRange = (Math.round(((total * 100) / highestTotal)) / 100) / SCALE_DOWN_FACTOR;

            if (upperRange === 0) {
                tableDataArray[i].aas.layout = this.getLayoutFromTemplate([0, 0.001]);
            } else {
                tableDataArray[i].aas.layout = this.getLayoutFromTemplate([0, upperRange]);
            }
        }

        for (let i = 0; i < tableDataArray.length; i++) {
            const id = tableDataArray[i].id;
            if (response.queries_metrics) {
                const metrics = response.queries_metrics[id].metrics
                for (const metricsKey in metrics) {
                    tableDataArray[i][metricsKey] = metrics[metricsKey]
                }
            }
        }

        return tableDataArray;
    }

    private getTotal(rankedQuery: TopQueriesTableData): number {
        let total = 0;

        for (const data of rankedQuery.aas.data) {
            total += data.x[0];
        }

        return total;
    }

    private getLayoutFromTemplate = (domain: number[]) => ({
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
            domain,
        },
        yaxis: {
            showgrid: false,
            zeroline: false,
            visible: false,
            fixedrange: true,
        },
    });

    private getTraceFromTemplate = (trace: Trace, i: number, name: string) => ({
        x: [trace.y_values_float![i]],
        y: [trace.x_values_string![i]],
        name: name,
        type: 'bar',
        orientation: 'h',
        hoverinfo: 'none',
        marker: {
            line: {
                color: 'grey',
                width: 0,
            },
            color: trace.color,
        },
        opacity: 0.9,
    });

    private hideZeroYValuesTraceFromLegend(trace: Trace): boolean {
        return trace.y_values_float?.reduce((a, b) => a + b, 0) !== 0;
    }

    private hideZeroValuesFromHoverbox(trace: Trace): 'none' | 'y+name' {
        return trace.y_values_float?.map(val => val === 0 ? 'none' : 'y+name') as unknown as 'none' | 'y+name';
    }
}