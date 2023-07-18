import {useContext, useEffect, useState} from 'react';

// material-ui
import {
    Box,
    Grid,
    Typography
} from '@mui/material';

// assets
import {PlanContext} from "../MainContext";
import {SummaryDiagram} from "./Plan/SummaryDiagram";
import {PlanService} from "./Plan/parser";
import {SummaryTable} from "./Plan/SummaryTable";
import MainCard from "./Plan/MainCard";
import {ErrorAlert} from "./ErrorReporting";
import {useNavigate} from "react-router-dom";
import {OverallStats} from "./Plan/OverallStats";


const planService = new PlanService();

const DashboardDefault = () => {
    const {plan} = useContext(PlanContext);
    const [error, setError] = useState()
    const [explained, setExplained] = useState({})
    const navigate = useNavigate();

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
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                    <Typography variant="h5">Overall statistics</Typography>
                </Grid>
            </Grid>
            <MainCard sx={{mt: 2, mb: 2}} content={false}>
                {Object.keys(explained).length !== 0 && (
                    <OverallStats stats={explained.stats}/>
                )}
            </MainCard>
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                    <Typography variant="h5">Diagram</Typography>
                </Grid>
                {Object.keys(explained).length !== 0 && (
                    <SummaryDiagram
                        summary={explained.summary}
                        stats={explained.stats}
                    />)
                }
            </Grid>
            <Grid>
                <Box sx={{m: 10}}/>
            </Grid>
            <Grid container>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Table</Typography>
                    </Grid>
                </Grid>
                <MainCard sx={{mt: 2}} content={false}>
                    {Object.keys(explained).length !== 0 && (
                        <SummaryTable
                            summary={explained.summary}
                            stats={explained.stats}
                        />)
                    }
                </MainCard>
            </Grid>

        </Grid>
    );
};

export default DashboardDefault;