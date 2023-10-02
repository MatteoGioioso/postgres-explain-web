import {useParams} from "react-router-dom";
import {activitiesService} from "./ioc";
import {useTimeIntervals} from "../CoreModules/timeIntervals";
import React, {useEffect, useState} from "react";
import {AnalyticsToolbar} from "./components/AnalyticsToolbar";
import {Box, Grid} from "@mui/material";
import {ErrorAlert, ErrorReport} from "../ErrorReporting";
import {Wrapper} from "../CoreModules/Wrapper";
import {useAutoRefresh} from "../CoreModules/autoRefresher";
import {QueryDetailsType, TopQueriesByFingerprintTableData} from "./services/Activities.service";
import {TopQueriesByFingerprintTable} from "../CoreModules/Activities/TopQueriesByFingerprintTable";
import Plot from "react-plotly.js";

const QueryDetails = () => {
    const {cluster_id, query_fingerprint} = useParams();
    const [error, setError] = useState<ErrorReport>()
    const {timeInterval, setTimeInterval} = useTimeIntervals();
    const [topQueriesByFingerprint, setTopQueriesByFingerprint] = useState<TopQueriesByFingerprintTableData[]>(undefined)
    const [queryDetails, setQueryDetails] = useState<QueryDetailsType>(undefined)

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
    }, [])

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
            <Grid container>
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
                        <Wrapper sx={{pt: 2}}>
                            <Plot
                                data={queryDetails.data}
                                layout={queryDetails.layout}
                                useResizeHandler
                                config={{displayModeBar: false}}
                                style={{width: '100%', height: '100%'}}
                            />
                        </Wrapper>
                    )}
                </Grid>
            </Grid>
        </>
    )
}

export default QueryDetails