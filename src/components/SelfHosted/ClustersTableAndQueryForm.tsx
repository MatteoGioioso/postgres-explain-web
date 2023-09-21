import {Box, Grid, Typography} from "@mui/material";
import MainCard from "../CoreModules/MainCard";
import {useNavigate, useParams} from "react-router-dom";
import {infoService, queryExplainerService} from "./ioc";
import React, {useEffect, useState} from "react";
import {PlansList} from "../CoreModules/PlansList";
import {QueryPlanListItem} from "../CoreModules/types";
import {Instance} from "./proto/info.pb";
import {QueryForm} from "../CoreModules/QueryForm";

const Wrapper = ({children, title, sx = {}}) => (
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

export const ClustersTableAndQueryForm = () => {
    const {cluster_id} = useParams();
    const [plansList, setPlansList] = useState([])
    const [clusterInstancesList, setClusterInstancesList] = useState<Instance[]>([])
    const [queriesList, setQueriesList] = useState(undefined)
    const navigate = useNavigate();

    useEffect(() => {
        Promise
            .all([
                    queryExplainerService.getQueryPlansList({cluster_name: cluster_id}),
                    infoService.getClusterInstancesList({cluster_name: cluster_id})
                    // analyticsService.getQueriesList({cluster_name: cluster_id})
                ]
            )
            .then(responses => {
                setPlansList(responses[0] as QueryPlanListItem[])
                setClusterInstancesList(responses[1])
                // setQueriesList(responses[1] as GetQueriesListResponse)
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

    const onClickRow = async (queryId, query, params) => {
        try {
            const planID = await queryExplainerService.saveQueryPlan({
                query_id: queryId,
                query,
                cluster_name: cluster_id,
                database: "postgres",
                parameters: params,
            });
            navigate(`/clusters/${cluster_id}/plans/${planID}`)
        } catch (e) {
            console.error(e)
        }
    }

    const onClickPlansList = (item) => {
        navigate(`/clusters/${cluster_id}/plans/${item.id}`)
    }

    return (
        <>
            {/*<Grid container>*/}
            {/*    <Grid item xs={12}>*/}
            {/*        <Wrapper sx={{pt: 2}} title={"Queries list"}>*/}
            {/*            {Boolean(queriesList?.queries?.length) && (*/}
            {/*                <QueriesListTable*/}
            {/*                    mappings={queriesList.mappings}*/}
            {/*                    queries={queriesList.queries}*/}
            {/*                    onClickRow={onClickRow}*/}
            {/*                />*/}
            {/*            )}*/}
            {/*        </Wrapper>*/}
            {/*    </Grid>*/}
            {/*</Grid>*/}
            {/*<Box sx={{pt: 4}}/>*/}
            <Grid container>
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

export default ClustersTableAndQueryForm