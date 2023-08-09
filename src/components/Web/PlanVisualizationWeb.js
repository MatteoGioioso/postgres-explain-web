import {useContext, useEffect, useState} from 'react';
import {Grid} from '@mui/material';
import {PlanContext} from "../../MainContext";
import {SummaryDiagram} from "../CoreModules/Plan/SummaryDiagram";
import {PlanService} from "../CoreModules/Plan/parser";
import {SummaryTable} from "../CoreModules/Plan/SummaryTable";
import {ErrorAlert} from "../ErrorReporting";
import {useNavigate} from "react-router-dom";
import {TableTabs} from "../CoreModules/Plan/tabs/TableTabs";
import {GeneralStatsTable} from "../CoreModules/Plan/stats/GeneralStatsTable";
import {RawPlan} from "../CoreModules/Plan/stats/RawPlan";
import {NodeContext} from "../CoreModules/Plan/Contexts";
import {GenericStatsTable, indexesHeadCells, nodesHeadCells, tablesHeadCells} from "../CoreModules/Plan/stats/GenericStatsTable";
import {planService, waitWebAssembly} from "./ioc";

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
        } catch (e) {
            setError({
                message: e.message,
            })
        }
    }

    useEffect(() => {
        if (plan) {
            waitWebAssembly().then(() => {
                fetchQueryPlan(plan)
            })
        } else {
            navigate('/')
        }
    }, [])

    return (
        <Grid container>
            {error && <ErrorAlert error={error}/>}
            <Grid container>
                <TableTabs tabs={["Diagram", "Table", "Stats", "Indexes", "Tables", "Nodes", "Raw plan"]}>
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
                        <GenericStatsTable stats={explained.indexes_stats} headCells={indexesHeadCells}/>
                    )}
                    {Boolean(explained) && (
                        <GenericStatsTable stats={explained.tables_stats} headCells={tablesHeadCells}/>
                    )}
                    {Boolean(explained) && (
                        <GenericStatsTable stats={explained.nodes_stats} headCells={nodesHeadCells}/>
                    )}

                    <RawPlan plan={plan && planService.fromSource(plan)}/>
                </TableTabs>
            </Grid>
        </Grid>
    );
};

export default PlanVisualizationWeb;