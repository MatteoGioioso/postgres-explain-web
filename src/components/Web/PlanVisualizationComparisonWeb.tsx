import React, {useContext, useEffect, useState} from "react";
import {ErrorAlert, ErrorReport} from "../ErrorReporting";
import {Box, Button, Grid, IconButton, Paper, Snackbar, Stack} from "@mui/material";
import {GeneralStatsComparisonTable} from "../CoreModules/Comparison/GeneralStatsComparisonTable";
import {TableTabs} from "../CoreModules/Plan/tabs/TableTabs";
import {SummaryComparisonDiagrams} from "../CoreModules/Comparison/SummaryComparisonDiagrams";
import {queryExplainerService} from "./ioc";
import {useNavigate, useParams} from "react-router-dom";
import {Comparison, ExplainedError, NodeComparison, PlanRow} from "../CoreModules/Plan/types";
import {PlanUploadErrorDescription, WasmErrorDescription} from "./Errors";
import {ComparePlanResponse} from "./QueryExplainer.service";
import {CloseOutlined, ShareAltOutlined} from "@ant-design/icons";
import {ButtonAction, UploadButton} from "../CoreModules/Buttons";
import {uploadSharablePlan} from "./utils";
import {TableTabsContext} from "../CoreModules/Plan/Contexts";

const PlanVisualizationComparisonWeb = () => {
    const [error, setError] = useState<ErrorReport>(null)
    const {plan_id, plan_id_to_compare} = useParams();
    const [comparisonResponse, setComparisonResponse] = useState<ComparePlanResponse>(null)

    async function fetchComparison() {
        try {
            const response = await queryExplainerService.comparePlans(plan_id, plan_id_to_compare);
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

    async function fetchNodeComparison(node: PlanRow, nodeToCompare: PlanRow): Promise<NodeComparison> {
        return queryExplainerService.compareNodes(node, nodeToCompare)
    }

    useEffect(() => {
        fetchComparison().then()
    }, [])

    return (
        <Grid container>
            <Toolbar/>
            {error && <ErrorAlert error={error} setError={setError}/>}
            <Grid container>
                <TableTabs
                    tabs={[
                        {
                            name: "Diagrams",
                            component: () => <SummaryComparisonDiagrams
                                planToCompare={comparisonResponse.planToCompare}
                                plan={comparisonResponse.plan}
                                compareNode={fetchNodeComparison}
                            />,
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

const Toolbar = () => {
    const navigate = useNavigate();
    const {plan_id} = useParams();
    const {tabIndex, setTabIndex} = useContext(TableTabsContext);

    return (
        <>
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