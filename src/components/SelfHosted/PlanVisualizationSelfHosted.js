import {useContext, useEffect, useState} from 'react';

import {Grid} from '@mui/material';
import {SummaryDiagram} from "../CoreModules/Plan/SummaryDiagram";
import {SummaryTable} from "../CoreModules/Plan/SummaryTable";
import {ErrorAlert} from "../ErrorReporting";
import {useParams} from "react-router-dom";
import {TableTabs} from "../CoreModules/Plan/tabs/TableTabs";
import {RawPlan} from "../CoreModules/Plan/stats/RawPlan";
import {NodeContext} from "../CoreModules/Plan/Contexts";
import {queryExplainerService} from "./ioc";
import {RawQuery} from "../CoreModules/Plan/stats/RawQuery";
import {GenericStatsTable, indexesHeadCells, nodesHeadCells, tablesHeadCells} from "../CoreModules/Plan/stats/GenericStatsTable";
import {GeneralStats} from "../CoreModules/Plan/stats/GeneralStats";

const PlanVisualizationSelfHosted = () => {
    const [error, setError] = useState()
    const {setExplained, explained} = useContext(NodeContext);
    const {plan_id} = useParams();

    async function getPlan() {
        try {
            const queryPlanResponse = await queryExplainerService.getQueryPlan({plan_id});
            setExplained(queryPlanResponse)
        } catch (e) {
            setError({
                message: e.message,
            })
        }
    }

    useEffect(() => {
        getPlan()
    }, [])

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
                        component: () => <RawQuery query={explained.query}/>,
                        show: Boolean(explained)
                    },
                    {
                        name: "Raw plan",
                        component: () => <RawPlan plan={explained.original_plan}/>,
                        show: Boolean(explained)
                    },
                ]}
                />
            </Grid>
        </Grid>
    );
};

export default PlanVisualizationSelfHosted;