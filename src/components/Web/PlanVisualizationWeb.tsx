import React, {useEffect, useState} from 'react';
import {Box, Grid, Stack} from '@mui/material';
import {SummaryDiagram} from "../CoreModules/Plan/SummaryDiagram";
import {SummaryTable} from "../CoreModules/Plan/SummaryTable";
import {ErrorAlert, ErrorReport} from "../ErrorReporting";
import {useNavigate, useParams} from "react-router-dom";
import {TableTabs, TabProp} from "../CoreModules/TableTabs";
import {RawPlan} from "../CoreModules/Plan/stats/RawPlan";
import {GenericStatsTable, indexesHeadCells, nodesHeadCells, tablesHeadCells} from "../CoreModules/Plan/stats/GenericStatsTable";
import {queryExplainerService} from "./ioc";
import {useFocus} from "../CoreModules/Plan/hooks";
import {GeneralStats} from "../CoreModules/Plan/stats/GeneralStats";
import {RawQuery} from "../CoreModules/Plan/stats/RawQuery";
import {PlanToolbar} from "../CoreModules/Plan/PlanToolbar";
import {QueryPlan, QueryPlanListItem, tabMaps} from "../CoreModules/types";
import {PlanNotFoundErrorDescription, WasmErrorDescription} from "./Errors";
import {Optimizations} from "./Optimizations";
import {ExplainedError} from "../CoreModules/Plan/types";
import {uploadSharablePlan} from "./utils";

export const TABS_MAP = () => {
    return {
        diagram: {
            index: 0,
            id: "diagram",
            name: "Diagram"
        },
        table: {
            index: 1,
            id: "table",
            name: "Table"
        },
        stats: {
            index: 2,
            id: "stats",
            name: "Stats"
        },
        indexes: {
            index: 3,
            id: "indexes",
            name: "Indexes"
        },
        tables: {
            index: 4,
            id: "tables",
            name: "Tables"
        },
        nodes: {
            index: 5,
            id: "nodes",
            name: "Nodes"
        },
        optimizations: {
            index: 6,
            id: "optimizations",
            name: "Optimizations"
        },
        query: {
            index: 7,
            id: "query",
            name: "Query"
        },
        rawPlan: {
            index: 8,
            id: "raw_plan",
            name: "Raw plan"
        },
    }
}

const PlanVisualizationWeb = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<ErrorReport>();
    const {plan_id} = useParams();
    const [enrichedQueryPlan, setEnrichedQueryPlan] = useState<QueryPlan>(null)
    const [optimizations, setOptimizations] = useState<QueryPlanListItem[]>(null)
    const [plansList, setPlansList] = useState<QueryPlanListItem[]>([])

    const {closeFocusNavigation} = useFocus();

    function fetchQueryPlan(planID: string) {
        try {
            const response = queryExplainerService.getQueryPlan(planID);
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

    const downloadSharablePlan = (planId: string) => {
        const queryPlan = queryExplainerService.getQueryPlan(planId);

        const url = window.URL.createObjectURL(
            new Blob([JSON.stringify(queryPlan, null, 2)]),
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
            'download',
            `${planId}.json`,
        );

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link)
    }

    const onSubmitPlanForm = (afterSubmitCallback: () => void) => async (values, {setErrors, setStatus, setSubmitting}) => {
        try {
            const planId = await queryExplainerService.saveQueryPlan({
                plan: values.plan,
                alias: values.alias,
                query: values.query,
                optimization_id: enrichedQueryPlan.optimization_id
            });
            navigate(`/plans/${planId}`)
        } catch (e) {
            try {
                const out: ExplainedError = JSON.parse(e.message);
                setError({
                    ...out,
                    description: <WasmErrorDescription error={out}/>
                })
            } catch (_) {
                setError({
                    error: e.message,
                    error_details: "",
                    error_stack: e.stack,
                })
            }
        } finally {
            afterSubmitCallback()
        }
    }

    const selectPlan = (planId: string) => {
        navigate(`/plans/${planId}`)
    }

    function fetchQueryPlansList() {
        const queryPlansList = queryExplainerService.getQueryPlansList();
        setPlansList(queryPlansList)
    }

    function fetchOptimizations(planId: string) {
        setOptimizations(queryExplainerService.getOptimizationsList(planId))
    }

    useEffect(() => {
        window.history.replaceState({}, document.title)

        fetchQueryPlan(plan_id)
        fetchOptimizations(plan_id)
        fetchQueryPlansList()
        closeFocusNavigation()
    }, [plan_id])

    function buildTableTabs(): TabProp[] {
        const obj = TABS_MAP()
        return [
            {
                name: obj.diagram.name, component: () => <SummaryDiagram
                    summary={enrichedQueryPlan.summary}
                    stats={enrichedQueryPlan.stats}
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
                        onSubmitOptimizationPlanForm={onSubmitPlanForm}
                        sharePlan={downloadSharablePlan}
                        uploadSharedPlan={uploadSharablePlan}
                        plansList={plansList}
                        selectPlan={selectPlan}
                    />
                </Stack>
            )}
            <Grid container>

                {error && <ErrorAlert error={error} setError={setError}/>}
                <Grid container>
                    <TableTabs tabs={buildTableTabs()} tabMaps={TABS_MAP()}/>
                </Grid>
            </Grid>
        </>
    );
}

export default PlanVisualizationWeb;