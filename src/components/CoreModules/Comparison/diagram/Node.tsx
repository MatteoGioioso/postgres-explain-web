import {
    Chip,
    Grid,
    Stack, Theme,
    Typography,
} from '@mui/material';
import {
    DollarOutlined,
    FallOutlined,
    FieldTimeOutlined, ForkOutlined,
    RiseOutlined,
} from '@ant-design/icons';
import React, {useEffect} from "react";
import {
    areRowsOverEstimated,
    getEstimationColor,
    getPercentage,
    getPercentageColor,
} from "../../utils";
import MainCard from "../../MainCard";
import {Node as ReactflowNodeProps} from 'reactflow'
import {NodeData} from "../../Plan/Contexts";

interface NodeProps extends NodeData, ReactflowNodeProps {
    theme: Theme
}

function showChipsBasedOnPercentage(percentage: number): boolean {
    return percentage > 15
}

function showRowEstimationChip(factor: number): boolean {
    return factor > 10
}

const Node = ({row, stats, theme, selected}: NodeProps) => {
    const exclusiveTimeColor = getPercentageColor(row.exclusive, row.execution_time, theme);
    const iconSize = '0.65rem'
    const chipHeight = '18px'

    return (
        <div
            id={`node_${row.node_id}`}
        >
            <MainCard
                border
                boxShadow
                sx={{cursor: 'pointer', p: 0, borderColor: selected ? theme.palette.primary.main : theme.palette.secondary.light}}
                contentSX={{p: '10px !important'}}
            >
                <Stack spacing={0.5}>

                    <Grid container alignItems="center">
                        <Typography variant="subtitle2" color="bold">
                            {row.operation}
                        </Typography>
                        <Grid item>
                            {Boolean(row.workers.launched) && (
                                <Chip
                                    style={{backgroundColor: theme.palette.primary['100']}}
                                    icon={<ForkOutlined style={{fontSize: iconSize, color: 'inherit'}}/>}
                                    sx={{ml: 1.25, pl: 1, height: chipHeight}}
                                    label={row.workers.launched + 1}
                                    size="small"
                                />
                            )}
                            {showChipsBasedOnPercentage(getPercentage(row.exclusive, row.execution_time)) && (
                                <Chip
                                    style={{backgroundColor: exclusiveTimeColor}}
                                    icon={<FieldTimeOutlined style={{fontSize: iconSize, color: 'inherit'}}/>}
                                    sx={{ml: 1.25, pl: 1, height: chipHeight}}
                                    size="small"
                                />
                            )}
                            {showChipsBasedOnPercentage(getPercentage(row.costs.total_cost, stats.max_cost)) && (
                                <Chip
                                    style={{backgroundColor: getPercentageColor(row.costs.total_cost, stats.max_cost, theme)}}
                                    icon={<DollarOutlined style={{fontSize: iconSize, color: 'inherit'}}/>}
                                    sx={{ml: 1.25, pl: 1, height: chipHeight}}
                                    size="small"
                                />
                            )}
                            {showRowEstimationChip(row.rows.estimation_factor) && (
                                <Chip
                                    style={{backgroundColor: getEstimationColor(row.rows.estimation_factor, theme), height: '18px'}}
                                    icon={
                                        <>
                                            {areRowsOverEstimated(row.rows.estimation_direction) ?
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
};

export default Node;