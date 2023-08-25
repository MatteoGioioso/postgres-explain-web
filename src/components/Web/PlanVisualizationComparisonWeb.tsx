import React, {useContext, useEffect, useState} from "react";
import {ErrorAlert, ErrorReport} from "../ErrorReporting";
import {Grid, Paper, Stack} from "@mui/material";
import {GeneralStatsComparisonTable} from "../CoreModules/Comparison/GeneralStatsComparisonTable";
import {TableTabs} from "../CoreModules/Plan/tabs/TableTabs";
import {SummaryComparisonDiagrams} from "../CoreModules/Comparison/SummaryComparisonDiagrams";
import {queryExplainerService} from "./ioc";
import {useNavigate, useParams} from "react-router-dom";
import {ExplainedError, NodeComparison, PlanRow} from "../CoreModules/Plan/types";
import {WasmErrorDescription} from "./Errors";
import {ComparePlanResponse} from "./QueryExplainer.service";
import {SwapOutlined} from "@ant-design/icons";
import {ButtonAction} from "../CoreModules/Buttons";
import {TableTabsContext} from "../CoreModules/Plan/Contexts";

const PlanVisualizationComparisonWeb = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<ErrorReport>(null)
    const {plan_id, plan_id_to_compare} = useParams();
    const [comparisonResponse, setComparisonResponse] = useState<ComparePlanResponse>(null)

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
        navigate(`/plans/${id}`)
    }

    async function fetchNodeComparison(node: PlanRow, nodeToCompare: PlanRow): Promise<NodeComparison> {
        return queryExplainerService.compareNodes(node, nodeToCompare)
    }

    function onClickSwap() {
        setComparisonResponse(null)
        navigate(`/plans/${plan_id_to_compare}/comparisons/${plan_id}`)
    }

    useEffect(() => {
        fetchComparison(plan_id, plan_id_to_compare).then()
    }, [])

    useEffect(() => {
        fetchComparison(plan_id, plan_id_to_compare).then()
    }, [plan_id_to_compare, plan_id])

    return (
        <Grid container>
            <Toolbar
                onClickSwap={onClickSwap}
            />
            {error && <ErrorAlert error={error} setError={setError}/>}
            <Grid container>
                <TableTabs
                    tabs={[
                        {
                            name: "Diagrams",
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
                            name: "Stats",
                            component: () => <GeneralStatsComparisonTable stats={comparisonResponse.comparison.general_stats}/>,
                            show: Boolean(comparisonResponse)
                        }
                    ]}
                />
            </Grid>
        </Grid>
    )
}

const Toolbar = (props) => {
    const navigate = useNavigate();
    const {plan_id, plan_id_to_compare} = useParams();
    const {tabIndex, setTabIndex} = useContext(TableTabsContext);

    return (
        <>
            <Paper
                elevation={0}
                sx={{
                    position: 'absolute',
                    right: '50%',
                    top: 75,
                    p: 0.5,
                    border: '1px solid',
                    transform: 'translate(50%, 0%)',
                    borderColor: theme => theme.palette.grey['A800'],
                    borderRadius: 2,
                    zIndex: 999
                }}
            >
                <Stack direction='row'>
                    <ButtonAction
                        onClick={props.onClickSwap}
                        icon={<SwapOutlined/>}
                    />
                </Stack>

            </Paper>

            <Paper
                elevation={0}
                sx={{
                    position: 'absolute',
                    right: 25,
                    top: 75,
                    p: 0.5,
                    border: '1px solid',
                    borderColor: theme => theme.palette.grey['A800'],
                    borderRadius: 2,
                    zIndex: 999
                }}
            >
                <Stack direction='row'>
                    <ButtonAction
                        title="Back to optimizations"
                        onClick={() => {
                            navigate(`/plans/${plan_id}`, {state: {from: 'comparison'}})
                        }}
                    />
                </Stack>

            </Paper>
        </>
    )
}

export default PlanVisualizationComparisonWeb