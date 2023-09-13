import React, {useEffect, useState} from 'react';

import {Grid, Stack} from '@mui/material';
import {SummaryDiagram} from "../CoreModules/Plan/SummaryDiagram";
import {SummaryTable} from "../CoreModules/Plan/SummaryTable";
import {ErrorAlert, ErrorReport} from "../ErrorReporting";
import {useNavigate, useParams} from "react-router-dom";
import {TableTabs, TabProp} from "../CoreModules/TableTabs";
import {RawPlan} from "../CoreModules/Plan/stats/RawPlan";
import {queryExplainerService} from "./ioc";
import {RawQuery} from "../CoreModules/Plan/stats/RawQuery";
import {GenericStatsTable, indexesHeadCells, nodesHeadCells, tablesHeadCells} from "../CoreModules/Plan/stats/GenericStatsTable";
import {GeneralStats} from "../CoreModules/Plan/stats/GeneralStats";
import {QueryPlan, QueryPlanListItem} from "../CoreModules/types";
import {PlanNotFoundErrorDescription} from "./Errors";
import {Optimizations} from "../Web/Optimizations";
import {PlanToolbar} from "../CoreModules/Plan/PlanToolbar";
import {uploadSharablePlan} from "../Web/utils";
import {PLAN_TABS_MAP} from "../CoreModules/tabsMaps";
import {PlanForm} from "../CoreModules/PlanForm";

const PlanVisualizationSelfHosted = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<ErrorReport>()
    const {cluster_id, plan_id} = useParams();
    const [enrichedQueryPlan, setEnrichedQueryPlan] = useState<QueryPlan>(null)
    const [optimizations, setOptimizations] = useState<QueryPlanListItem[]>(null)
    const [plansList, setPlansList] = useState<QueryPlanListItem[]>([])

    async function fetchQueryPlan(planID: string) {
        try {
            const response = await queryExplainerService.getQueryPlan({plan_id: planID});
            if (!response) {
                setError({
                    error: "Plan not found",
                    error_details: "",
                    error_stack: "",
                    severity: "warning",
                    description: <PlanNotFoundErrorDescription/>
                })
                return
            }
            setEnrichedQueryPlan(response)
            setError(null)
        } catch (e) {
            setError({
                error: e.message,
                error_stack: "",
                error_details: ""
            })
        }
    }

    async function fetchQueryPlansList(clusterId: string) {
        try {
            const queryPlanListItems = await queryExplainerService.getQueryPlansList({cluster_name: clusterId});
            setPlansList(queryPlanListItems)
            setError(null)
        } catch (e) {
            setError({
                error: e.message,
                error_stack: "",
                error_details: ""
            })
        }
    }

    const selectPlan = (planId: string) => {
        navigate(`/clusters/${cluster_id}/plans/${planId}`)
    }

    const sharePlan = (planId: string) => {

    }

    const onSubmitOptimizationForm = (afterSubmitCallback: () => void) => async (values, {setErrors, setStatus, setSubmitting}) => {

        afterSubmitCallback()
    }

    useEffect(() => {
        window.history.replaceState({}, document.title)
        Promise.all([
            fetchQueryPlan(plan_id),
            fetchQueryPlansList(cluster_id)
        ]).then()
    }, [plan_id])


    function buildTableTabs(): TabProp[] {
        const obj = PLAN_TABS_MAP()
        return [
            {
                name: obj.diagram.name, component: () => <SummaryDiagram
                    summary={enrichedQueryPlan.summary}
                    stats={enrichedQueryPlan.stats}
                    queryExplainerService={queryExplainerService}
                />,
                show: Boolean(enrichedQueryPlan)
            },
            {
                name: obj.table.name,
                component: () => <SummaryTable
                    summary={enrichedQueryPlan.summary}
                    stats={enrichedQueryPlan.stats}
                />,
                show: Boolean(enrichedQueryPlan)
            },
            {
                name: obj.stats.name,
                component: () => <GeneralStats
                    stats={enrichedQueryPlan.stats}
                    jitStats={enrichedQueryPlan.jit_stats}
                    triggers={enrichedQueryPlan.triggers_stats}
                />,
                show: Boolean(enrichedQueryPlan)
            },
            {
                name: obj.indexes.name,
                component: () => <GenericStatsTable stats={enrichedQueryPlan.indexes_stats} headCells={indexesHeadCells}/>,
                show: Boolean(enrichedQueryPlan)
            },
            {
                name: obj.tables.name,
                component: () => <GenericStatsTable stats={enrichedQueryPlan.tables_stats} headCells={tablesHeadCells}/>,
                show: Boolean(enrichedQueryPlan)
            },
            {
                name: obj.nodes.name,
                component: () => <GenericStatsTable stats={enrichedQueryPlan.nodes_stats} headCells={nodesHeadCells}/>,
                show: Boolean(enrichedQueryPlan)
            },
            {
                name: obj.optimizations.name,
                component: () => <Optimizations optimizations={optimizations}/>,
                show: Boolean(optimizations?.length > 1)
            },
            {
                name: obj.query.name,
                component: () => <RawQuery query={enrichedQueryPlan.query}/>,
                show: Boolean(enrichedQueryPlan?.query)
            },
            {
                name: obj.rawPlan.name,
                component: () => <RawPlan plan={enrichedQueryPlan.original_plan}/>,
                show: Boolean(enrichedQueryPlan?.original_plan)
            },
        ]
    }

    return (
        <>
            {Boolean(enrichedQueryPlan) && (
                <Stack direction='row' justifyContent='end'>
                    <PlanToolbar
                        plan={enrichedQueryPlan}
                        sharePlan={sharePlan}
                        uploadSharedPlan={uploadSharablePlan}
                        plansList={plansList}
                        selectPlan={selectPlan}
                        optimizationModalContent={(callback) => (
                            <>
                                <PlanForm onSubmit={onSubmitOptimizationForm(callback)} />
                            </>
                        )

                        }
                    />
                </Stack>
            )}
            <Grid container>
                {error && <ErrorAlert error={error} setError={setError}/>}
                <Grid container>
                    <TableTabs tabs={buildTableTabs()} tabMaps={PLAN_TABS_MAP()}/>
                </Grid>
            </Grid>
        </>
    );
};

export default PlanVisualizationSelfHosted;