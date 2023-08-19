import {Grid} from "@mui/material";
import {OptimizationsList} from "../CoreModules/Optimization/OptimizationsList";
import {QueryPlanListItem} from "../CoreModules/types";
import {useNavigate} from "react-router-dom";
import {OptimizationsComparisons} from "../CoreModules/Optimization/OptimizationsComparisons";

interface OptimizationsProps {
    optimizations: QueryPlanListItem[]
}

export const Optimizations = ({optimizations}: OptimizationsProps) => {
    const navigate = useNavigate();

    function onClickOptimization(opt: QueryPlanListItem) {
        navigate(`/plans/${opt.id}`)
    }

    function onClickCompare(planId: string, planIdToCompare: string) {
        console.log(planId, planIdToCompare)
    }

    return (
        <Grid container>
            <Grid item xs={6}>
                <OptimizationsList optimizations={optimizations} onClickOptimization={onClickOptimization}/>
            </Grid>
            <Grid item xs={6} sx={{pl: 2}}>
                <OptimizationsComparisons optimizations={optimizations} onClickCompare={onClickCompare} />
            </Grid>
        </Grid>
    )
}