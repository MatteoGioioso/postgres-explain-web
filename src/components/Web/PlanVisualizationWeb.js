import {useContext, useEffect, useState} from 'react';

// material-ui
import {
    Box, Collapse,
    Grid, Tab, Tabs,
    Typography
} from '@mui/material';

// assets
import {PlanContext} from "../../MainContext";
import {SummaryDiagram} from "../CoreModules/Plan/SummaryDiagram";
import {PlanService} from "../CoreModules/Plan/parser";
import {SummaryTable} from "../CoreModules/Plan/SummaryTable";
import {ErrorAlert} from "../ErrorReporting";
import {useNavigate} from "react-router-dom";
import {TableTabs} from "../CoreModules/Plan/tabs/TableTabs";
import {GeneralStatsTable} from "../CoreModules/Plan/stats/GeneralStatsTable";
import {RawPlan} from "../CoreModules/Plan/stats/RawPlan";
import {IndexesStatsTable} from "../CoreModules/Plan/stats/IndexesStatsTable";
import {NodeContext} from "../CoreModules/Plan/Contexts";

const planService = new PlanService();

const PlanVisualizationWeb = () => {
    const {plan} = useContext(PlanContext);
    const [error, setError] = useState()
    const navigate = useNavigate();
    const {setExplained, explained} = useContext(NodeContext);

    function fetchQueryPlan(queryPlan) {
        if (!queryPlan) return

        const plan = planService.fromSource(queryPlan);
        console.log(JSON.parse(plan))
        try {
            // eslint-disable-next-line
            const go = new Go()

            WebAssembly.instantiateStreaming(fetch('/main.wasm'), go.importObject).then(res => {
                go.run(res.instance)
                const out = global.explain(plan)

                if (out.error) {
                    console.error(`${out.error}: ${out.error_details}`)

                    setError({
                        message: out.error,
                        error_details: out.error_details,
                        stackTrace: out.error_stack,
                    })
                } else {
                    const parsedExplained = JSON.parse(out.explained);
                    console.log(parsedExplained)
                    setExplained(parsedExplained)
                }
            })

        } catch (e) {
            setError({
                message: e.message,
            })
        }
    }

    useEffect(() => {
        if (plan) {
            fetchQueryPlan(plan)
        } else {
            navigate('/')
        }
    }, [])

    return (
        <Grid container>
            {error && <ErrorAlert error={error}/>}
            <Grid container>
                <TableTabs tabs={["Diagram", "Table", "Stats", "Indexes", "Raw plan"]}>
                    {Boolean(explained) && (
                        <SummaryDiagram
                            summary={explained.summary}
                            stats={explained.stats}
                        />)
                    }
                    {Boolean(explained) && (
                        <SummaryTable
                            summary={explained.summary}
                            stats={explained.stats}
                        />)
                    }
                    {Boolean(explained) && (
                        <GeneralStatsTable
                            stats={explained.stats}
                        />)
                    }
                    {Boolean(explained) && (
                        <IndexesStatsTable stats={explained.indexes_stats}/>
                    )}

                    <RawPlan plan={plan && planService.fromSource(plan)}/>
                </TableTabs>
            </Grid>
        </Grid>
    );
};

export default PlanVisualizationWeb;