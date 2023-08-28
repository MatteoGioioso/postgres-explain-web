import {
    Box,
    Chip,
    Grid,
    LinearProgress,
    LinearProgressProps,
    Stack, Tooltip,
    Typography,
} from '@mui/material';
import MainCard from '../../MainCard';
import {
    DollarOutlined,
    FallOutlined,
    FieldTimeOutlined, ForkOutlined, HddOutlined, Loading3QuartersOutlined,
    RiseOutlined,
} from '@ant-design/icons';
import React from "react";
import {
    areRowsOverEstimated,
    betterNumbers, betterTiming,
    getEstimationColor,
    getPercentage,
    getPercentageColor,
} from "../../utils";
import {PlanRow, Stats} from "../types";
import {useFocus} from "../hooks";
import {GenericDetailsPopover} from "../../GenericDetailsPopover";

interface NodeProps {
    data: PlanRow
    theme: any
    stats: Stats
}

function LinearProgressWithLabel(props: LinearProgressProps & { value: number, time: number, theme: any, cellWarningColor: string }) {
    return (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Box sx={{width: '75%', mr: 1, position: 'relative'}}>
                <LinearProgress variant="determinate" value={props.value} sx={{
                    backgroundColor: props.theme.palette.secondary.lighter,
                    height: "20px",
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: props.cellWarningColor
                    }
                }}/>
                <Typography
                    color="text.primary"
                    style={{position: 'absolute', top: 0, left: "50%", transform: "translate(-50%)"}}
                >
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
            <Box sx={{width: 'auto'}}>
                <Typography color="text.primary">
                    {betterTiming(props.time)}
                </Typography>
            </Box>
        </Box>
    );
}

function showChipsBasedOnPercentage(percentage: number): boolean {
    return percentage > 15
}

function showRowEstimationChip(factor: number): boolean {
    return factor > 10
}

const Node = ({data, stats, theme}: NodeProps) => {
        const {isFocused, focus, switchToRow} = useFocus(data.node_id);
        const exclusiveTimeColor = getPercentageColor(data.exclusive, data.execution_time, theme);
        const exclusiveTimePercentage = getPercentage(data.exclusive, data.execution_time);

        const getStyle = () => {
            const hoverOrFocus = {
                width: 'auto',
                minWidth: theme.diagram.node.width,
                boxShadow: theme.customShadows.z1,
                border: `2px solid ${theme.palette.secondary.main} !important`
            }

            if (isFocused) {
                return hoverOrFocus
            }

            return {
                width: 'auto',
                minWidth: theme.diagram.node.width,
            }
        }

        const iconStyle = {fontSize: '0.75rem', color: 'inherit'};

        return (
            <div
                id={`node_${data.node_id}`}
                onClick={focus}
            >
                <MainCard
                    contentSX={{p: 1.5}}
                    sx={getStyle()}
                    border
                    boxShadow
                >
                    <Stack spacing={0.5}>

                        <Grid container alignItems="center">
                            <Typography variant="h5" color="bold">
                                {data.operation}
                            </Typography>
                            <Grid item>
                                {Boolean(data.workers.launched) && (
                                    <Tooltip title={`Number of workers`}>
                                        <Chip
                                            style={{backgroundColor: theme.palette.primary['100'], cursor: 'inherit'}}
                                            icon={<ForkOutlined style={iconStyle}/>}
                                            sx={{ml: 1.25, pl: 1}}
                                            label={data.workers.launched + 1}
                                            size="small"
                                        />
                                    </Tooltip>
                                )}
                                {Boolean(data.loops > 1) && (
                                    <Tooltip title={`Number of loops ${data.workers.launched > 0 ? 'per worker' : ''}`}>
                                        <Chip
                                            style={{backgroundColor: theme.palette.primary['100'], cursor: 'inherit'}}
                                            icon={<Loading3QuartersOutlined style={iconStyle}/>}
                                            sx={{ml: 1.25, pl: 1}}
                                            label={betterNumbers(data.loops / (data.workers.launched + 1))}
                                            size="small"
                                        />
                                    </Tooltip>

                                )}
                                {showChipsBasedOnPercentage(getPercentage(data.exclusive, data.execution_time)) && (
                                    <Tooltip title="High exclusive time">
                                        <Chip
                                            style={{backgroundColor: exclusiveTimeColor, cursor: 'inherit'}}
                                            icon={<FieldTimeOutlined style={iconStyle}/>}
                                            sx={{ml: 1.25, pl: 1}}
                                            size="small"
                                        />
                                    </Tooltip>
                                )}
                                {showChipsBasedOnPercentage(getPercentage(data.costs.total_cost, stats.max_cost)) && (
                                    <Tooltip title="High cost">
                                        <Chip
                                            style={{backgroundColor: getPercentageColor(data.costs.total_cost, stats.max_cost, theme)}}
                                            icon={<DollarOutlined style={iconStyle}/>}
                                            sx={{ml: 1.25, pl: 1}}
                                            size="small"
                                        />
                                    </Tooltip>
                                )}
                                {showRowEstimationChip(data.rows.estimation_factor) && (
                                    <Tooltip
                                        title={`${areRowsOverEstimated(data.rows.estimation_direction) ? 'Rows over-estimated' : 'Rows under-estimated'}`}>
                                        <Chip
                                            style={{backgroundColor: getEstimationColor(data.rows.estimation_factor, theme)}}
                                            icon={
                                                <>
                                                    {areRowsOverEstimated(data.rows.estimation_direction) ?
                                                        <RiseOutlined style={iconStyle}/> :
                                                        <FallOutlined style={iconStyle}/>
                                                    }
                                                </>
                                            }
                                            sx={{ml: 1.25, pl: 1}}
                                            size="small"
                                        />
                                    </Tooltip>
                                )}
                                {(getPercentage(data.buffers.effective_blocks_read, stats.max_blocks_read) >= 10
                                    || getPercentage(data.buffers.effective_blocks_written, stats.max_blocks_written) >= 10) && (
                                    <Tooltip title={`High disk usage`}>
                                        <Chip
                                            style={{
                                                backgroundColor: getPercentageColor(
                                                    Math.max(data.buffers.effective_blocks_read, data.buffers.effective_blocks_written),
                                                    stats.max_blocks_read,
                                                    theme
                                                )
                                            }}
                                            icon={<HddOutlined style={iconStyle}/>}
                                            sx={{ml: 1.25, pl: 1}}
                                            size="small"
                                        />
                                    </Tooltip>
                                )}
                                {data.cte_sub_plan_of && (
                                    <Tooltip title={`CTE:  ${data.cte_sub_plan_of}`}>
                                        <Chip
                                            style={{backgroundColor: theme.palette.secondary.light}}
                                            sx={{ml: 1.25}}
                                            size="small"
                                            label="CTE"
                                        />
                                    </Tooltip>
                                )}
                                {data.sub_plan_of && (
                                    <Tooltip title={`SubPlan:  ${data.sub_plan_of}`}>
                                        <Chip
                                            style={{backgroundColor: theme.palette.secondary.light}}
                                            sx={{ml: 1.25}}
                                            size="small"
                                            label="SubPlan"
                                        />
                                    </Tooltip>
                                )}
                            </Grid>
                        </Grid>
                    </Stack>

                    {Boolean(data.exclusive) && (
                        <Box sx={{pt: 2, pb: 2}}>
                            <LinearProgressWithLabel
                                cellWarningColor={exclusiveTimeColor}
                                theme={theme}
                                value={exclusiveTimePercentage}
                                time={data.exclusive}
                            />
                        </Box>
                    )}

                    <Box sx={{pt: 1}}>
                        <Typography sx={{color: `${exclusiveTimeColor || 'primary'}.main`}}>
                            Rows returned: {` `}
                            <b>{betterNumbers(data.rows.total)}</b>
                        </Typography>{' '}
                    </Box>
                </MainCard>
            </div>
        );
    }
;

export default Node;