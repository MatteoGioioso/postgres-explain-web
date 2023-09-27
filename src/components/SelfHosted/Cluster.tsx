import {Box, Grid, Typography} from "@mui/material";
import MainCard from "../CoreModules/MainCard";
import {useNavigate, useParams} from "react-router-dom";
import {activitiesService, infoService, queryExplainerService} from "./ioc";
import React, {useEffect, useState} from "react";
import {QueryPlanListItem} from "../CoreModules/types";
import {Instance} from "./proto/info.pb";
import Plot from 'react-plotly.js';
import {ChartObject, TableData} from "./services/Activities.service";
import {ErrorAlert, ErrorReport} from "../ErrorReporting";
import {TopQueriesTable} from "../CoreModules/Tables/TopQueriesTable";
import {PlotRelayoutEvent} from "plotly.js";
import {useAutoRefresh} from "../CoreModules/autoRefresher";
import {ClusterToolbar} from "./components/ClusterToolbar";
import {getTime, getTimeIntervalName, useTimeIntervals} from "../CoreModules/timeIntervals";
import dayjs from "dayjs";

export const Wrapper = ({children, title = "", sx = {}}) => (
    <>
        <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
                <Typography variant="h5">{title}</Typography>
            </Grid>
        </Grid>
        <Box sx={{...sx}}>
            <MainCard
                content={false}
                border
            >
                <Box>{children}</Box>
            </MainCard>
        </Box>
    </>
);

export const Cluster = () => {
    const {cluster_id} = useParams();
    const [clusterInstancesList, setClusterInstancesList] = useState<Instance[]>([])
    const [activities, setActivities] = useState<ChartObject>(undefined)
    const [topQueries, setTopQueries] = useState<TableData[]>(undefined)
    const [error, setError] = useState<ErrorReport>()
    const navigate = useNavigate();
    const {timeInterval, setTimeInterval} = useTimeIntervals();

    const fetchActivities = () => {
        Promise.all([
            activitiesService.getProfile({
                from: timeInterval.from(),
                to: timeInterval.to(),
                clusterName: cluster_id
            }),
            activitiesService.getTopQueries({
                from: timeInterval.from(),
                to: timeInterval.to(),
                clusterName: cluster_id
            })
        ]).then(responses => {
            setActivities(responses[0] as ChartObject)
            setTopQueries(responses[1] as TableData[])
        }).catch(e => {
            // TODO handle error
            console.error(e)
        })
    }

    const {refreshInterval, setRefreshInterval} = useAutoRefresh([fetchActivities]);

    useEffect(() => {
        fetchActivities()
    }, [timeInterval.id]);

    useEffect(() => {
        infoService
            .getClusterInstancesList({cluster_name: cluster_id})
            .then(response => {
                setClusterInstancesList(response)
            })
            .catch(e => {
                // TODO handle error
                console.error(e)
            })
    }, []);

    const onClickExplainTopQuery = async (fingerprint, params, instanceName) => {
        try {
            const planID = await queryExplainerService.saveQueryPlan({
                query_fingerprint: fingerprint,
                cluster_name: cluster_id,
                instance_name: instanceName,
                parameters: params,
            });
            navigate(`/clusters/${cluster_id}/plans/${planID}`)
        } catch (e) {
            setError({
                error: e.message,
                error_stack: "",
                error_details: ""
            })
        }
    }

    return (
        <>
            <ClusterToolbar
                onSelectAutoRefreshInterval={setRefreshInterval}
                autoRefreshInterval={refreshInterval}
                timeInterval={timeInterval}
                onSelectTimeInterval={setTimeInterval}
            />
            <Box sx={{pt: 2}}/>
            <Grid container>
                {error && <ErrorAlert error={error} setError={setError}/>}
                <Grid item xs={12}>
                    <Wrapper sx={{pt: 2}} title="Activities">
                        {Boolean(activities) && (
                            <Plot
                                data={activities.traces}
                                layout={activities.layout}
                                useResizeHandler
                                onRelayout={(e: PlotRelayoutEvent) => {
                                    console.log(e)
                                    if (e.autosize || Object.keys(e).length === 0) return;

                                    const from = e["xaxis.range[0]"].toString()
                                    const to = e["xaxis.range[1]"].toString()

                                    setTimeInterval({
                                        to: () => getTime(to),
                                        from: () => getTime(from),
                                        name: getTimeIntervalName(from, to),
                                        id: getTimeIntervalName(from, to)
                                    })
                                }}
                                config={{displayModeBar: false, doubleClick: false}}
                                style={{width: '100%', height: '100%'}}
                            />
                        )}
                    </Wrapper>
                </Grid>
                <Grid item xs={12}>
                    <Wrapper sx={{pt: 2}}>
                        {Boolean(topQueries?.length > 0) && (
                            <TopQueriesTable
                                tableDataArray={topQueries}
                                onClickExplainTopQuery={onClickExplainTopQuery}
                                clusterInstancesList={clusterInstancesList}
                            />
                        )}
                    </Wrapper>
                </Grid>

            </Grid>
        </>
    )
}

export default Cluster