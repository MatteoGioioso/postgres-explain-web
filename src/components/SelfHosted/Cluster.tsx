import {Box, Grid, Typography} from "@mui/material";
import MainCard from "../CoreModules/MainCard";
import {useNavigate, useParams} from "react-router-dom";
import {activitiesService, infoService, queryExplainerService} from "./ioc";
import React, {useEffect, useState} from "react";
import {PlansList} from "../CoreModules/PlansList";
import {QueryPlanListItem} from "../CoreModules/types";
import {Instance} from "./proto/info.pb";
import {QueryForm} from "../CoreModules/QueryForm";
import Plot from 'react-plotly.js';
import {ChartObject, TableData} from "./services/Activities.service";
import {ErrorAlert, ErrorReport} from "../ErrorReporting";
import moment from "moment"
import {TopQueriesTable} from "../CoreModules/Tables/TopQueriesTable";
import {PlotRelayoutEvent} from "plotly.js";

const Wrapper = ({children, title = "", sx = {}}) => (
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
    const [plansList, setPlansList] = useState([])
    const [clusterInstancesList, setClusterInstancesList] = useState<Instance[]>([])
    const [activities, setActivities] = useState<ChartObject>(undefined)
    const [topQueries, setTopQueries] = useState<TableData[]>(undefined)
    const [queriesList, setQueriesList] = useState(undefined)
    const [error, setError] = useState<ErrorReport>()
    const navigate = useNavigate();

    useEffect(() => {
        Promise
            .all([
                    queryExplainerService.getQueryPlansList({cluster_name: cluster_id}),
                    infoService.getClusterInstancesList({cluster_name: cluster_id}),
                    activitiesService.getProfile({
                        from: moment(new Date()).subtract(1, 'hour').utc().format('YYYY-MM-DDTHH:mm:ssZ'),
                        to: moment(new Date()).utc().format('YYYY-MM-DDTHH:mm:ssZ'),
                        clusterName: cluster_id
                    }),
                    activitiesService.getTopQueries({
                        from: moment(new Date()).subtract(1, 'hour').utc().format('YYYY-MM-DDTHH:mm:ssZ'),
                        to: moment(new Date()).utc().format('YYYY-MM-DDTHH:mm:ssZ'),
                        clusterName: cluster_id
                    })
                ]
            )
            .then(responses => {
                setPlansList(responses[0] as QueryPlanListItem[])
                setClusterInstancesList(responses[1] as Instance[])
                setActivities(responses[2] as ChartObject)
                setTopQueries(responses[3] as TableData[])
            })
            .catch(e => {
                console.error(e)
            })
    }, []);

    async function onSubmitCustomQuery(values, {setErrors, setStatus, setSubmitting}) {
        const planID = await queryExplainerService.saveQueryPlan({
            query: values.query,
            cluster_name: cluster_id,
            instance_name: values.instanceName,
            database: "postgres"
        });
        navigate(`/clusters/${cluster_id}/plans/${planID}`)
    }

    const onClickExplainTopQuery = async (queryId, query, params, instanceName, database) => {
        try {
            const planID = await queryExplainerService.saveQueryPlan({
                query_id: queryId,
                query,
                cluster_name: cluster_id,
                instance_name: instanceName,
                database: database || "postgres",
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

    const onClickPlansList = (item) => {
        navigate(`/clusters/${cluster_id}/plans/${item.id}`)
    }

    return (
        <>
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
                                    // setTimerange(e["xaxis.range[0]"], e["xaxis.range[1]"])
                                }}
                                config={{displayModeBar: false}}
                                style={{width: '100%', height: '100%'}}
                            />
                        )}
                    </Wrapper>
                </Grid>
                <Grid item xs={12}>
                    <Wrapper sx={{pt: 2}}>
                        {Boolean(topQueries?.length > 0) && (
                            <TopQueriesTable tableDataArray={topQueries} onClickExplainTopQuery={onClickExplainTopQuery}
                                             clusterInstancesList={clusterInstancesList}/>
                        )}
                    </Wrapper>
                </Grid>
                <Grid item xs={8}>
                    <Wrapper sx={{pt: 2, pr: 2}} title="Custom query">
                        {Boolean(clusterInstancesList?.length) && (
                            <Box sx={{p: 3}}>
                                <QueryForm clusterInstancesList={clusterInstancesList} onSubmit={onSubmitCustomQuery}/>
                            </Box>
                        )}
                    </Wrapper>
                </Grid>
                <Grid item xs={4}>
                    <Wrapper sx={{pt: 2}} title="Plans">
                        {Boolean(plansList?.length) && (
                            <PlansList items={plansList} clusterId={cluster_id} onClick={onClickPlansList}/>
                        )}
                    </Wrapper>
                </Grid>
            </Grid>
        </>
    )
}

export default Cluster