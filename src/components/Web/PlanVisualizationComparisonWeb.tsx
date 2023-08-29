import React, {useEffect, useState} from "react";
import {ErrorAlert, ErrorReport} from "../ErrorReporting";
import {Grid, Stack} from "@mui/material";
import {GeneralStatsComparisonTable} from "../CoreModules/Comparison/GeneralStatsComparisonTable";
import {TableTabs} from "../CoreModules/TableTabs";
import {SummaryComparisonDiagrams} from "../CoreModules/Comparison/SummaryComparisonDiagrams";
import {queryExplainerService} from "./ioc";
import {useNavigate, useParams} from "react-router-dom";
import {ExplainedError, NodeComparison, PlanRow, Stats} from "../CoreModules/Plan/types";
import {WasmErrorDescription} from "./Errors";
import {ComparePlanResponse} from "./QueryExplainer.service";
import {TABS_MAP as planVisualizationTabsMap} from "./PlanVisualizationWeb"
import {SelectChangeEvent} from "@mui/material/Select";
import {QueryPlanListItem} from "../CoreModules/types";
import {Toolbar} from "../CoreModules/Comparison/ComparisonToolbar";
import {lowerFirst} from "lodash";

export const TABS_MAP = () => {
    return {
        diagram: {
            index: 0,
            id: "diagram",
            name: "Diagram"
        },
        stats: {
            index: 1,
            id: "stats",
            name: "Stats"
        },
    }
}

const PlanVisualizationComparisonWeb = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<ErrorReport>(null)
    const {plan_id, plan_id_to_compare} = useParams();
    const [comparisonResponse, setComparisonResponse] = useState<ComparePlanResponse>(null)
    const [optimizations, setOptimizations] = useState<QueryPlanListItem[]>()

    async function fetchComparison(id, idToCompare) {
        try {
            const response = await queryExplainerService.comparePlans(id, idToCompare);
            if (!response) {
                setError({
                    error: "plans to compare not found",
                    error_details: "one of the plan for comparison was not found",
                    error_stack: "",
                    severity: "warning"
                })
            }
            setComparisonResponse(response)
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
        }
    }

    function onClickPlanIdTitle(id: string) {
        navigate(`/plans/${id}`, {state: {tab: planVisualizationTabsMap().optimizations.id}})
    }

    async function fetchNodeComparison(node: PlanRow, nodeToCompare: PlanRow): Promise<NodeComparison> {
        return queryExplainerService.compareNodes(node, nodeToCompare)
    }

    function fetchOptimizations(planId: string) {
        const optimizationsList = queryExplainerService.getOptimizationsList(planId);
        setOptimizations(optimizationsList)
    }

    function onClickSwap() {
        setComparisonResponse(null)
        navigate(`/plans/${plan_id_to_compare}/comparisons/${plan_id}`)
    }

    function onClickGoBackToOptimizations() {
        navigate(`/plans/${plan_id}`, {state: {tab: planVisualizationTabsMap().optimizations.id}})
    }

    const handleChange = (e: SelectChangeEvent) => {
        setComparisonResponse(null)
        navigate(`/plans/${e.target.value}/comparisons/${plan_id_to_compare}`)
    }

    const handleChangeToCompare = (e: SelectChangeEvent) => {
        setComparisonResponse(null)
        navigate(`/plans/${plan_id}/comparisons/${e.target.value}`)
    }

    useEffect(() => {
        fetchComparison(plan_id, plan_id_to_compare).then()
        fetchOptimizations(plan_id)
    }, [])

    useEffect(() => {
        fetchComparison(plan_id, plan_id_to_compare).then()
    }, [plan_id_to_compare, plan_id])

    return (
        <>
            <Stack direction='row' justifyContent='center'>
                <Toolbar
                    onClickSwap={onClickSwap}
                    optimizations={optimizations}
                    handleChange={handleChange}
                    handleChangeToCompare={handleChangeToCompare}
                    onClickGoBackToOptimizations={onClickGoBackToOptimizations}
                />
            </Stack>
            <Grid container>

                {error && <ErrorAlert error={error} setError={setError}/>}
                <Grid container>
                    <TableTabs
                        tabMaps={TABS_MAP()}
                        tabs={[
                            {
                                name: TABS_MAP().diagram.name,
                                component: () => (
                                    <SummaryComparisonDiagrams
                                        onClickPlanIdTitle={onClickPlanIdTitle}
                                        onClickPlanToCompareIdTitle={onClickPlanIdTitle}
                                        planToCompare={comparisonResponse.planToCompare}
                                        plan={comparisonResponse.plan}
                                        compareNode={fetchNodeComparison}
                                    />
                                ),
                                show: Boolean(comparisonResponse)
                            },
                            {
                                name: TABS_MAP().stats.name,
                                component: () => <GeneralStatsComparisonTable stats={comparisonResponse.comparison.general_stats}/>,
                                show: Boolean(comparisonResponse)
                            }
                        ]}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default PlanVisualizationComparisonWeb