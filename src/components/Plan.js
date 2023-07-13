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
import MainCard from "./MainCard";


const planService = new PlanService();

const DashboardDefault = () => {
    const {plan} = useContext(PlanContext);
    const [error, setError] = useState()
    const [explained, setExplained] = useState({})

    function fetchQueryPlan(queryPlan) {
        if (!queryPlan) return

        const plan = planService.fromSource(queryPlan);

        try {
            // eslint-disable-next-line
            const go = new Go()

            WebAssembly.instantiateStreaming(fetch('/main.wasm'), go.importObject).then(res => {
                go.run(res.instance)
                const out = global.explain(plan)

                console.log(out)

                if (out.error) {
                    console.error(`${out.error}: ${out.error_details}`)

                    setError({
                        message: out.error,
                        error_details: out.error_details,
                        stackTrace: out.error_stack,
                    })
                } else {
                    setExplained(JSON.parse(out.explained))
                }
            })

        } catch (e) {
            setError({
                message: e.message,
            })
        }
    }


    useEffect(() => {
        fetchQueryPlan(plan)
    }, [plan])

    return (
        <Grid container>
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
                <Box sx={{m: 10}} />
            </Grid>
            <Grid container>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Table</Typography>
                    </Grid>
                    <Grid item/>
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