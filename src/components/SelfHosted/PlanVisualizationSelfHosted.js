import {useContext, useEffect, useState} from 'react';

import {Grid} from '@mui/material';
import {SummaryDiagram} from "../CoreModules/Plan/SummaryDiagram";
import {SummaryTable} from "../CoreModules/Plan/SummaryTable";
import {ErrorAlert} from "../ErrorReporting";
import {useParams} from "react-router-dom";
import {TableTabs} from "../CoreModules/Plan/tabs/TableTabs";
import {GeneralStatsTable} from "../CoreModules/Plan/stats/GeneralStatsTable";
import {RawPlan} from "../CoreModules/Plan/stats/RawPlan";
import {IndexesStatsTable} from "../CoreModules/Plan/stats/IndexesStatsTable";
import {NodeContext} from "../CoreModules/Plan/Contexts";
import {queryExplainerService} from "./ioc";
import {RawQuery} from "../CoreModules/Plan/stats/RawQuery";

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
                <TableTabs tabs={["Diagram", "Table", "Stats", "Indexes", "Raw plan", "Query"]}>
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

                    {Boolean(explained) && (
                        <RawPlan plan={explained.original_plan}/>
                    )}
                    {Boolean(explained) && (
                        <RawQuery query={explained.query} />
                    )}
                </TableTabs>
            </Grid>
        </Grid>
    );
};

export default PlanVisualizationSelfHosted;