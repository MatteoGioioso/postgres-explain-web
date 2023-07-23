// material-ui
import {
    Box,
    CardContent,
    Chip,
    Collapse,
    Divider,
    Grid,
    LinearProgress,
    LinearProgressProps,
    Stack,
    Typography,
} from '@mui/material';
// project import
import MainCard from '../MainCard';

// assets
import {
    DollarOutlined,
    DownOutlined,
    FallOutlined,
    FieldTimeOutlined, ForkOutlined,
    RiseOutlined, TableOutlined,
    ZoomInOutlined
} from '@ant-design/icons';
import React, {useContext, useState} from "react";
import {
    areRowsOverEstimated,
    betterNumbers,
    getEstimationColor,
    getPercentage,
    getPercentageColor,
} from "../utils";
import {PlanRow, Stats} from "../types";
import {ExpandMore} from "../ExpandMore";
import {useFocus, useNodeHover} from "../hooks";
import {TableTabsContext} from "../Contexts";

interface NodeProps {
    data: PlanRow
    theme: any
    stats: Stats
}

function LinearProgressWithLabel(props: LinearProgressProps & { value: number, theme: any, cellWarningColor: string }) {
    return (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Box sx={{width: '100%', mr: 1}}>
                <LinearProgress variant="determinate" {...props} sx={{
                    backgroundColor: props.theme.palette.secondary.lighter,
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: props.cellWarningColor
                    }
                }}/>
            </Box>
            <Box sx={{minWidth: 35}}>
                <Typography variant="body2" color="text.secondary">
                    {`${Math.round(props.value)}%`}
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
        const {isHovered, unsetHover, setHover} = useNodeHover(data.node_id);
        const {setTabIndex} = useContext(TableTabsContext);
        const exclusiveTimeColor = getPercentageColor(data.exclusive, data.execution_time, theme);
        const exclusiveTimePercentage = getPercentage(data.exclusive, data.execution_time);

        const getStyle = () => {
            const hoverOrFocus = {
                width: 'auto',
                minWidth: theme.diagram.node.width,
                boxShadow: `0px 0px 60px 25px ${theme.palette.secondary.main}`,
                border: `1px solid ${theme.palette.secondary.main} !important`
            }

            if (isFocused) {
                return hoverOrFocus
            }

            if (isHovered(data.node_id)) {
                return hoverOrFocus
            }
            return {width: 'auto', minWidth: theme.diagram.node.width}
        }

        return (
            <div
                id={`node_${data.node_id}`}
                onMouseLeave={unsetHover}
                onMouseEnter={setHover}
            >
                <MainCard
                    contentSX={{p: 1.5}}
                    sx={getStyle()}
                    boxShadow
                >
                    <Stack spacing={0.5}>

                        <Grid container alignItems="center">
                            <Typography variant="h5" color="bold">
                                {data.operation}
                            </Typography>
                            <Grid item>
                                {Boolean(data.workers.launched) && (
                                    <Chip
                                        style={{backgroundColor: theme.palette.primary['100']}}
                                        icon={<ForkOutlined style={{fontSize: '0.75rem', color: 'inherit'}}/>}
                                        sx={{ml: 1.25, pl: 1}}
                                        label={data.workers.launched + 1}
                                        size="small"
                                    />
                                )}
                                {showChipsBasedOnPercentage(getPercentage(data.exclusive, data.execution_time)) && (
                                    <Chip
                                        style={{backgroundColor: exclusiveTimeColor}}
                                        icon={<FieldTimeOutlined style={{fontSize: '0.75rem', color: 'inherit'}}/>}
                                        sx={{ml: 1.25, pl: 1}}
                                        size="small"
                                    />
                                )}
                                {showChipsBasedOnPercentage(getPercentage(data.costs.total_cost, stats.max_cost)) && (
                                    <Chip
                                        style={{backgroundColor: getPercentageColor(data.costs.total_cost, stats.max_cost, theme)}}
                                        icon={<DollarOutlined style={{fontSize: '0.75rem', color: 'inherit'}}/>}
                                        sx={{ml: 1.25, pl: 1}}
                                        size="small"
                                    />
                                )}
                                {showRowEstimationChip(data.rows.estimation_factor) && (
                                    <Chip
                                        style={{backgroundColor: getEstimationColor(data.rows.estimation_factor, theme)}}
                                        icon={
                                            <>
                                                {areRowsOverEstimated(data.rows.estimation_direction) ?
                                                    <RiseOutlined style={{fontSize: '0.75rem', color: 'inherit'}}/> :
                                                    <FallOutlined style={{fontSize: '0.75rem', color: 'inherit'}}/>
                                                }
                                            </>
                                        }
                                        sx={{ml: 1.25, pl: 1}}
                                        size="small"
                                    />
                                )}
                                {data.sub_plan_of && (
                                    <Chip
                                        style={{backgroundColor: theme.palette.secondary.light}}
                                        sx={{ml: 1.25}}
                                        size="small"
                                        label="CTE"
                                    />
                                )}
                                <Chip
                                    style={{backgroundColor: theme.palette.secondary["A100"]}}
                                    icon={<TableOutlined style={{fontSize: '0.90rem', color: 'inherit'}}/>}
                                    sx={{ml: 1.25, pl: 1}}
                                    size="medium"
                                    onClick={async () => {
                                        // If the tab is set to, for example, Indexes, the app will crash because it won't find the row id
                                        // of the main table. Moreover the switchToRow cannot happen asynchronously, thus we must wait
                                        // that setTabIndex has finished
                                        await setTabIndex(0)
                                        switchToRow()
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Stack>
                    {showChipsBasedOnPercentage(exclusiveTimePercentage) && (
                        <Box sx={{pt: 1, pb: 1}}>
                            <LinearProgressWithLabel cellWarningColor={exclusiveTimeColor} theme={theme} value={exclusiveTimePercentage}/>
                        </Box>
                    )}
                    <Box sx={{pt: 1}}>
                        <Typography sx={{color: `${exclusiveTimeColor || 'primary'}.main`}}>
                            Rows returned: {` `}
                            <b>{betterNumbers(data.rows.total * (data.workers.launched + 1))}</b>
                        </Typography>{' '}
                    </Box>
                    <Box sx={{pt: 1, pb: 0}}>
                        <Divider/>
                    </Box>
                </MainCard>
            </div>
        );
    }
;

export default Node;