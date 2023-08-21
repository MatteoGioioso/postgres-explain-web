import {useEffect, useState} from "react";
import {ErrorAlert, ErrorReport} from "../ErrorReporting";
import {Grid} from "@mui/material";
import {GeneralStatsComparisonTable} from "../CoreModules/Comparison/GeneralStatsComparisonTable";
import {TableTabs} from "../CoreModules/Plan/tabs/TableTabs";
import {SummaryComparisonDiagrams} from "../CoreModules/Comparison/SummaryComparisonDiagrams";
import {queryExplainerService} from "./ioc";
import {useParams} from "react-router-dom";
import {Comparison, ExplainedError} from "../CoreModules/Plan/types";
import {WasmErrorDescription} from "./Errors";
import {ComparePlanResponse} from "./QueryExplainer.service";

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

    useEffect(() => {
        fetchComparison().then()
    }, [])

    return (
        <Grid container>
            {error && <ErrorAlert error={error} setError={setError}/>}
            <Grid container>
                <TableTabs
                    tabs={[
                        {
                            name: "Diagrams",
                            component: () => <SummaryComparisonDiagrams planToCompare={comparisonResponse.planToCompare}
                                                                        plan={comparisonResponse.plan}/>,
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

export default PlanVisualizationComparisonWeb