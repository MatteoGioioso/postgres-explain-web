import {useContext, useEffect, useState} from 'react';
import {Grid} from '@mui/material';
import {SummaryDiagram} from "../CoreModules/Plan/SummaryDiagram";
import {SummaryTable} from "../CoreModules/Plan/SummaryTable";
import {ErrorAlert} from "../ErrorReporting";
import {useParams} from "react-router-dom";
import {TableTabs} from "../CoreModules/Plan/tabs/TableTabs";
import {GeneralStatsTable} from "../CoreModules/Plan/stats/GeneralStatsTable";
import {RawPlan} from "../CoreModules/Plan/stats/RawPlan";
import {NodeContext} from "../CoreModules/Plan/Contexts";
import {GenericStatsTable, indexesHeadCells, nodesHeadCells, tablesHeadCells} from "../CoreModules/Plan/stats/GenericStatsTable";
import {queryExplainerService} from "./ioc";

const PlanVisualizationWeb = () => {
    const [error, setError] = useState();
    const {plan_id} = useParams();
    const {setExplained, explained} = useContext(NodeContext);

    function fetchQueryPlan(planID) {
        try {
            const response = queryExplainerService.getQueryPlan(planID);
            setExplained(response.query_plan)
        } catch (e) {
            setError({
                message: e.message,
            })
        }
    }

    useEffect(() => {
        fetchQueryPlan(plan_id)
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

                    {/*<RawPlan plan={}/>*/}
                </TableTabs>
            </Grid>
        </Grid>
    );
};

export default PlanVisualizationWeb;