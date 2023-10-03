import {useParams} from "react-router-dom";
import {activitiesService} from "./ioc";
import {useTimeIntervals} from "../CoreModules/timeIntervals";
import React, {useEffect, useState} from "react";
import {AnalyticsToolbar} from "./components/AnalyticsToolbar";
import {Box, Grid, Stack} from "@mui/material";
import {ErrorAlert, ErrorReport} from "../ErrorReporting";
import {Wrapper} from "../CoreModules/Wrapper";
import {useAutoRefresh} from "../CoreModules/autoRefresher";
import {QueryDetailsType, TopQueriesByFingerprintTableData} from "./services/Activities.service";
import {TopQueriesByFingerprintTable} from "../CoreModules/Activities/TopQueriesByFingerprintTable";
import Plot from "react-plotly.js";
import Plotly from 'plotly.js-cartesian-dist-min'

const QueryDetails = () => {
    const {cluster_id, query_fingerprint} = useParams();
    const [error, setError] = useState<ErrorReport>()
    const {timeInterval, setTimeInterval} = useTimeIntervals();
    const [topQueriesByFingerprint, setTopQueriesByFingerprint] = useState<TopQueriesByFingerprintTableData[]>(undefined)
    const [queryDetails, setQueryDetails] = useState<QueryDetailsType>(undefined)
    const [plotRefsMap, setPlotRefsMap] = useState<{ [key: string]: any }>({})

    const fetchQueryDetails = () => {
        Promise
            .all([
                activitiesService.getTopQueriesByFingerprint({
                    from: timeInterval.from(),
                    to: timeInterval.to(),
                    clusterName: cluster_id,
                    fingerprint: query_fingerprint
                }),
                activitiesService.getQueryDetails({
                    from: timeInterval.from(),
                    to: timeInterval.to(),
                    clusterName: cluster_id,
                    fingerprint: query_fingerprint
                })
            ])
            .then(responses => {
                setTopQueriesByFingerprint(responses[0] as TopQueriesByFingerprintTableData[])
                setQueryDetails(responses[1] as QueryDetailsType)
            })
            .catch(e => {
                console.error(e)
                setError({
                    error: e.message,
                    error_stack: "",
                    error_details: ""
                })
            })
    }

    const {refreshInterval, setRefreshInterval} = useAutoRefresh([fetchQueryDetails]);

    useEffect(() => {
        fetchQueryDetails()
    }, [timeInterval.id])

    return (
        <>
            <AnalyticsToolbar
                onSelectAutoRefreshInterval={setRefreshInterval}
                autoRefreshInterval={refreshInterval}
                timeInterval={timeInterval}
                onSelectTimeInterval={setTimeInterval}
                refresh={() => fetchQueryDetails()}
            />
            <Box sx={{pt: 2}}/>
            <Grid container spacing={2}>
                {error && <ErrorAlert error={error} setError={setError}/>}

                <Grid item xs={12}>
                    {Boolean(topQueriesByFingerprint) && (
                        <Wrapper sx={{pt: 2}} title="Activities">
                            <TopQueriesByFingerprintTable
                                tableDataArray={topQueriesByFingerprint}
                                onClickExplainTopQuery={() => {
                                }}
                                clusterInstancesList={[]}
                            />
                        </Wrapper>
                    )}
                </Grid>

                <Grid item xs={12}>
                    {Boolean(queryDetails) && (
                        Object.values(queryDetails).map(detail => (
                            <>
                                <Box sx={{pt: 3}}/>
                                <Wrapper sx={{pt: 1}} title={detail.name}>
                                    <Plot
                                        onInitialized={(figure, graphDiv) => {
                                            setPlotRefsMap(prevState => ({
                                                ...prevState,
                                                [detail.name]: graphDiv
                                            }))
                                        }}
                                        data={detail.data}
                                        layout={detail.layout}
                                        useResizeHandler
                                        config={{displayModeBar: false}}
                                        style={{width: '100%', height: '100%'}}
                                        onHover={event => {
                                            const points = event.points
                                                .map(point => ({curveNumber: point.curveNumber, pointNumber: point.pointNumber}));

                                            Object
                                                .keys(plotRefsMap)
                                                .filter(key => key !== detail.name)
                                                .forEach(key => Plotly.Fx.hover(plotRefsMap[key], points))
                                        }}
                                        onUnhover={event => {
                                            Object
                                                .keys(plotRefsMap)
                                                .filter(key => key !== detail.name)
                                                .forEach(key => {
                                                    Plotly.Fx.hover(plotRefsMap[key], [])
                                                })
                                        }}
                                    />
                                </Wrapper>
                            </>
                        ))
                    )}
                </Grid>
            </Grid>
        </>
    )
}

export default QueryDetails