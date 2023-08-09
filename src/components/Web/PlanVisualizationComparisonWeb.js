import {useContext, useEffect, useState} from "react";
import {planService, waitWebAssembly} from "./ioc";
import {ErrorAlert} from "../ErrorReporting";
import {Grid} from "@mui/material";
import {planOptimized, planPrev} from "./plan";
import {GeneralStatsComparisonTable} from "../CoreModules/Comparison/GeneralStatsComparisonTable";
import {TableTabs} from "../CoreModules/Plan/tabs/TableTabs";
import {SummaryComparisonDiagrams} from "../CoreModules/Comparison/SummaryComparisonDiagrams";
import {SummaryDiagram} from "../CoreModules/Plan/SummaryDiagram";

const PlanVisualizationComparisonWeb = () => {
    const [comparison, setComparison] = useState()
    const [error, setError] = useState()
    const [prev, setPrev] = useState()
    const [optimized, setOptimized] = useState()

    function fetchComparison(planPrev, planOptimized) {
        const parsedPlanPrev = planService.fromSource(planPrev);
        const parsedPlanOptimized = planService.fromSource(planOptimized);

        try {
            const out1 = global.explain(parsedPlanPrev)
            const out2 = global.explain(parsedPlanOptimized)
            if (out1.error || out2.error) {
                console.error(`${out.error}: ${out.error_details}`)

                setError({
                    message: out.error,
                    error_details: out.error_details,
                    stackTrace: out.error_stack,
                })
                return
            }
            console.log(JSON.parse(out1.explained))
            setPrev(JSON.parse(out1.explained))
            setOptimized(JSON.parse(out2.explained))

            const out = global.compare(out1.explained, out2.explained)

            if (out.error) {
                console.error(`${out.error}: ${out.error_details}`)

                setError({
                    message: out.error,
                    error_details: out.error_details,
                    stackTrace: out.error_stack,
                })
            } else {
                const parsedComparison = JSON.parse(out.comparison);
                console.log(parsedComparison)
                setComparison(parsedComparison)
            }
        } catch (e) {
            setError({
                message: e.message,
            })
        }
    }

    useEffect(() => {
        waitWebAssembly().then(() => {
            fetchComparison(JSON.stringify(planPrev), JSON.stringify(planOptimized))
        })
    }, [])

    return (
        <Grid container>
            {error && <ErrorAlert error={error}/>}
            <Grid container>
                <TableTabs tabs={["Diagrams", "Stats"]}>
                    {Boolean(prev) && (
                        <SummaryComparisonDiagrams planPrev={prev.summary} planOptimized={optimized.summary}/>
                    )}
                    {Boolean(comparison) && (
                        <GeneralStatsComparisonTable stats={comparison.general_stats}/>
                    )}

                </TableTabs>
            </Grid>
        </Grid>
    )
}

export default PlanVisualizationComparisonWeb