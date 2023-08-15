import {useContext, useEffect, useState} from 'react';
import {Grid} from '@mui/material';
import {SummaryDiagram} from "../CoreModules/Plan/SummaryDiagram";
import {SummaryTable} from "../CoreModules/Plan/SummaryTable";
import {ErrorAlert, ErrorReport} from "../ErrorReporting";
import {useParams} from "react-router-dom";
import {TableTabs} from "../CoreModules/Plan/tabs/TableTabs";
import {RawPlan} from "../CoreModules/Plan/stats/RawPlan";
import {NodeContext} from "../CoreModules/Plan/Contexts";
import {GenericStatsTable, indexesHeadCells, nodesHeadCells, tablesHeadCells} from "../CoreModules/Plan/stats/GenericStatsTable";
import {queryExplainerService} from "./ioc";
import {useFocus} from "../CoreModules/Plan/hooks";
import {GeneralStats} from "../CoreModules/Plan/stats/GeneralStats";
import {RawQuery} from "../CoreModules/Plan/stats/RawQuery";
import {PlanToolbar} from "./PlanToolbar";
import {QueryPlan} from "../CoreModules/types";

const PlanVisualizationWeb = () => {
    const [error, setError] = useState<ErrorReport>();
    const {plan_id} = useParams();
    // const {setExplained, explained} = useContext(NodeContext);
    const [enrichedQueryPlan, setEnrichedQueryPlan] = useState<QueryPlan>(null)
    const {closeFocusNavigation} = useFocus();

    function fetchQueryPlan(planID) {
        try {
            const response = queryExplainerService.getQueryPlan(planID);
            setEnrichedQueryPlan(response)
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
            <PlanToolbar />
            {error && <ErrorAlert error={error}/>}
            <Grid container>
                <TableTabs tabs={[
                    {
                        name: "Diagram", component: () => <SummaryDiagram
                            summary={enrichedQueryPlan.summary}
                            stats={enrichedQueryPlan.stats}
                        />,
                        show: Boolean(enrichedQueryPlan)
                    },
                    {
                        name: "Table",
                        component: () => <SummaryTable
                            summary={enrichedQueryPlan.summary}
                            stats={enrichedQueryPlan.stats}
                        />,
                        show: Boolean(enrichedQueryPlan)
                    },
                    {
                        name: "Stats",
                        component: () => <GeneralStats
                            stats={enrichedQueryPlan.stats}
                            jitStats={enrichedQueryPlan.jit_stats}
                            triggers={enrichedQueryPlan.triggers_stats}
                        />,
                        show: Boolean(enrichedQueryPlan)
                    },
                    {
                        name: "Indexes",
                        component: () => <GenericStatsTable stats={enrichedQueryPlan.indexes_stats} headCells={indexesHeadCells}/>,
                        show: Boolean(enrichedQueryPlan)
                    },
                    {
                        name: "Tables",
                        component: () => <GenericStatsTable stats={enrichedQueryPlan.tables_stats} headCells={tablesHeadCells}/>,
                        show: Boolean(enrichedQueryPlan)
                    },
                    {
                        name: "Nodes",
                        component: () => <GenericStatsTable stats={enrichedQueryPlan.nodes_stats} headCells={nodesHeadCells}/>,
                        show: Boolean(enrichedQueryPlan)
                    },
                    {
                        name: "Query",
                        component: () => <RawQuery query={enrichedQueryPlan.query}/>,
                        show: Boolean(enrichedQueryPlan?.query)
                    },
                    {
                        name: "Raw plan",
                        component: () => <RawPlan plan={enrichedQueryPlan.original_plan}/>,
                        show: Boolean(enrichedQueryPlan?.original_plan)
                    },
                ]}
                />
            </Grid>
        </Grid>
    );
}

export default PlanVisualizationWeb;