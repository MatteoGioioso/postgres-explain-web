import {useEffect, useState} from "react";
import {ErrorAlert, ErrorReport} from "../ErrorReporting";
import {Grid} from "@mui/material";
import {GeneralStatsComparisonTable} from "../CoreModules/Comparison/GeneralStatsComparisonTable";
import {TableTabs} from "../CoreModules/Plan/tabs/TableTabs";
import {SummaryComparisonDiagrams} from "../CoreModules/Comparison/SummaryComparisonDiagrams";

const PlanVisualizationComparisonWeb = () => {
    const [error, setError] = useState<ErrorReport>(null)

    function fetchComparison(planPrev, planOptimized) {
        try {
        } catch (e) {
            setError(null)
        }
    }

    useEffect(() => {
    }, [])

    return (
        <Grid container>
            {error && <ErrorAlert error={error} setError={setError}/>}
            <Grid container>
                <TableTabs
                    tabs={[
                        {
                            name: "Diagrams",
                            component: () => <SummaryComparisonDiagrams planPrev={null} planOptimized={null}/>,
                            show: Boolean(true)
                        },
                        {
                            name: "Stats",
                            component: () => <GeneralStatsComparisonTable stats={null}/>,
                            show: Boolean(true)
                        }
                    ]}
                />
            </Grid>
        </Grid>
    )
}

export default PlanVisualizationComparisonWeb