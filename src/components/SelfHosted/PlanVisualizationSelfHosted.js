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
import {SummaryTable} from "../CoreModules/Plan/SummaryTable";
import {ErrorAlert} from "../ErrorReporting";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {TableTabs} from "../CoreModules/Plan/tabs/TableTabs";
import {GeneralStatsTable} from "../CoreModules/Plan/stats/GeneralStatsTable";
import {RawPlan} from "../CoreModules/Plan/stats/RawPlan";
import {IndexesStatsTable} from "../CoreModules/Plan/stats/IndexesStatsTable";
import {NodeContext} from "../CoreModules/Plan/Contexts";
import {QueryExplainerRepository} from "./datalayer/QueryExplainer.repository";
import {getBackendOrigin} from "../../config";
import {QueryExplainerService} from "./services/QueryExplainer.service";

const queryExplainerRepository = new QueryExplainerRepository(getBackendOrigin());
const queryExplainerService = new QueryExplainerService(queryExplainerRepository);

const PlanVisualizationSelfHosted = () => {
    const {plan} = useContext(PlanContext);
    const [error, setError] = useState()
    const navigate = useNavigate();
    const {setExplained, explained} = useContext(NodeContext);
    const {state} = useLocation();
    const {cluster_id, plan_id} = useParams();

    async function explainQuery(query) {
        try {
            const queryPlanResponse = await queryExplainerService.getQueryPlanCustom({
                query,
                cluster_name: cluster_id,
                database: "postgres",
                namespace: null
            });

            setExplained(queryPlanResponse)
        } catch (e) {
            setError({
                message: e.message,
            })
        }
    }

    useEffect(() => {
        if (state.query) {
            explainQuery(state.query)
        } else {
            navigate(`/clusters/${cluster_id}`)
        }
    }, [])

    return (
        <Grid container>
            {error && <ErrorAlert error={error}/>}
            <Grid container>
                <TableTabs>
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

                    <RawPlan plan={{}}/>
                </TableTabs>
            </Grid>
        </Grid>
    );
};

export default PlanVisualizationSelfHosted;