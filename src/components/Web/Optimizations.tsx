import {Grid, Stack} from "@mui/material";
import {OptimizationsList} from "../CoreModules/Optimization/OptimizationsList";
import {QueryPlanListItem} from "../CoreModules/types";
import {useNavigate, useParams} from "react-router-dom";
import {OptimizationsComparisons} from "../CoreModules/Optimization/OptimizationsComparisons";
import {OptimizationsAnalytics} from "../CoreModules/Optimization/OptimizationsAnalytics";
import {OptimizationsComparisonsSelects} from "../CoreModules/Optimization/OptimizationsComparisonsSelects";

interface OptimizationsProps {
    optimizations: QueryPlanListItem[]
}

export const Optimizations = ({optimizations}: OptimizationsProps) => {
    const navigate = useNavigate();

    function onClickOptimization(opt: QueryPlanListItem) {
        navigate(`/plans/${opt.id}`)
    }

    function onClickCompare(planId: string, planIdToCompare: string) {
        navigate(`/plans/${planId}/comparisons/${planIdToCompare}`)
    }

    return (
        <Grid container>
            <Grid item xs={6}>
                <OptimizationsList optimizations={optimizations} onClickOptimization={onClickOptimization}/>
            </Grid>
            <Grid item xs={6} sx={{pl: 2}}>
                <Stack spacing={2}>
                <OptimizationsComparisonsSelects optimizations={optimizations} onClickCompare={onClickCompare} />
                <OptimizationsAnalytics optimizations={optimizations} />
                </Stack>
            </Grid>
        </Grid>
    )
}