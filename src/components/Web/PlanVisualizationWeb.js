import {useContext, useEffect, useState} from 'react';
import {Grid} from '@mui/material';
import {SummaryDiagram} from "../CoreModules/Plan/SummaryDiagram";
import {SummaryTable} from "../CoreModules/Plan/SummaryTable";
import {ErrorAlert} from "../ErrorReporting";
import {useParams} from "react-router-dom";
import {TableTabs} from "../CoreModules/Plan/tabs/TableTabs";
import {RawPlan} from "../CoreModules/Plan/stats/RawPlan";
import {NodeContext} from "../CoreModules/Plan/Contexts";
import {GenericStatsTable, indexesHeadCells, nodesHeadCells, tablesHeadCells} from "../CoreModules/Plan/stats/GenericStatsTable";
import {queryExplainerService} from "./ioc";
import {useFocus} from "../CoreModules/Plan/hooks";
import {GeneralStats} from "../CoreModules/Plan/stats/GeneralStats";
import {RawQuery} from "../CoreModules/Plan/stats/RawQuery";

const PlanVisualizationWeb = () => {
    const [error, setError] = useState();
    const {plan_id} = useParams();
    const {setExplained, explained} = useContext(NodeContext);
    const [originalPlan, setOriginalPlan] = useState("{}")
    const [query, setQuery] = useState("")
    const {closeFocusNavigation} = useFocus();

    function fetchQueryPlan(planID) {
        try {
            const response = queryExplainerService.getQueryPlan(planID);
            setExplained(response.query_plan)
            setOriginalPlan(response.query_original_plan)
            setQuery(response.query)
        } catch (e) {
            setError({
                message: e.message,
            })
        }
    }

    useEffect(() => {
        fetchQueryPlan(plan_id)
        closeFocusNavigation()
    }, [plan_id])

    return (
        <Grid container>
            {error && <ErrorAlert error={error}/>}
            <Grid container>
                <TableTabs tabs={[
                    {
                        name: "Diagram", component: () => <SummaryDiagram
                            summary={explained.summary}
                            stats={explained.stats}
                        />,
                        show: Boolean(explained)
                    },
                    {
                        name: "Table",
                        component: () => <SummaryTable
                            summary={explained.summary}
                            stats={explained.stats}
                        />,
                        show: Boolean(explained)
                    },
                    {
                        name: "Stats",
                        component: () => <GeneralStats
                            stats={explained.stats}
                            jitStats={explained.jit_stats}
                            triggers={explained.triggers_stats}
                        />,
                        show: Boolean(explained)
                    },
                    {
                        name: "Indexes",
                        component: () => <GenericStatsTable stats={explained.indexes_stats} headCells={indexesHeadCells}/>,
                        show: Boolean(explained)
                    },
                    {
                        name: "Tables",
                        component: () => <GenericStatsTable stats={explained.tables_stats} headCells={tablesHeadCells}/>,
                        show: Boolean(explained)
                    },
                    {
                        name: "Nodes",
                        component: () => <GenericStatsTable stats={explained.nodes_stats} headCells={nodesHeadCells}/>,
                        show: Boolean(explained)
                    },
                    {
                        name: "Query",
                        component: () => <RawQuery query={query}/>,
                        show: Boolean(query)
                    },
                    {
                        name: "Raw plan",
                        component: () => <RawPlan plan={originalPlan}/>,
                        show: Boolean(originalPlan)
                    },
                ]}
                />
            </Grid>
        </Grid>
    );
}

export default PlanVisualizationWeb;