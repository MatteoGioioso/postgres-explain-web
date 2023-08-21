import {
    Chip,
    Grid,
    Stack,
    Typography,
} from '@mui/material';
import {
    DollarOutlined,
    FallOutlined,
    FieldTimeOutlined, ForkOutlined,
    RiseOutlined,
} from '@ant-design/icons';
import React from "react";
import {
    areRowsOverEstimated,
    getEstimationColor,
    getPercentage,
    getPercentageColor,
} from "../../utils";
import MainCard from "../../MainCard";
import {PlanRow, Stats} from "../../Plan/types";

interface NodeProps {
    data: PlanRow
    theme: any
    stats: Stats
}

function showChipsBasedOnPercentage(percentage: number): boolean {
    return percentage > 15
}

function showRowEstimationChip(factor: number): boolean {
    return factor > 10
}

const Node = ({data, stats, theme}: NodeProps) => {
        const exclusiveTimeColor = getPercentageColor(data.exclusive, data.execution_time, theme);
        const iconSize = '0.65rem'
        const chipHeight = '18px'

        return (
            <div
                id={`node_${data.node_id}`}
            >
                <MainCard
                    border
                    boxShadow
                    sx={{cursor: 'pointer', p: 0}}
                    contentSX={{p: '10px !important'}}
                >
                    <Stack spacing={0.5}>

                        <Grid container alignItems="center">
                            <Typography variant="subtitle2" color="bold">
                                {data.operation}
                            </Typography>
                            <Grid item>
                                {Boolean(data.workers.launched) && (
                                    <Chip
                                        style={{backgroundColor: theme.palette.primary['100']}}
                                        icon={<ForkOutlined style={{fontSize: iconSize, color: 'inherit'}}/>}
                                        sx={{ml: 1.25, pl: 1, height: chipHeight}}
                                        label={data.workers.launched + 1}
                                        size="small"
                                    />
                                )}
                                {showChipsBasedOnPercentage(getPercentage(data.exclusive, data.execution_time)) && (
                                    <Chip
                                        style={{backgroundColor: exclusiveTimeColor}}
                                        icon={<FieldTimeOutlined style={{fontSize: iconSize, color: 'inherit'}}/>}
                                        sx={{ml: 1.25, pl: 1, height: chipHeight}}
                                        size="small"
                                    />
                                )}
                                {showChipsBasedOnPercentage(getPercentage(data.costs.total_cost, stats.max_cost)) && (
                                    <Chip
                                        style={{backgroundColor: getPercentageColor(data.costs.total_cost, stats.max_cost, theme)}}
                                        icon={<DollarOutlined style={{fontSize: iconSize, color: 'inherit'}}/>}
                                        sx={{ml: 1.25, pl: 1, height: chipHeight}}
                                        size="small"
                                    />
                                )}
                                {showRowEstimationChip(data.rows.estimation_factor) && (
                                    <Chip
                                        style={{backgroundColor: getEstimationColor(data.rows.estimation_factor, theme), height: '18px'}}
                                        icon={
                                            <>
                                                {areRowsOverEstimated(data.rows.estimation_direction) ?
                                                    <RiseOutlined style={{fontSize: iconSize, color: 'inherit'}}/> :
                                                    <FallOutlined style={{fontSize: iconSize, color: 'inherit'}}/>
                                                }
                                            </>
                                        }
                                        sx={{ml: 1.25, pl: 1}}
                                        size="small"
                                    />
                                )}
                            </Grid>
                        </Grid>
                    </Stack>
                </MainCard>
            </div>
        );
    }
;

export default Node;