// material-ui
import {Box, CardContent, Chip, Collapse, Divider, Grid, LinearProgress, LinearProgressProps, Stack, Typography} from '@mui/material';
// project import
import MainCard from '../MainCard';

// assets
import {DownOutlined, FallOutlined, FieldTimeOutlined, RiseOutlined, SelectOutlined} from '@ant-design/icons';
import React, {useState} from "react";
import {
    areRowsOverEstimated,
    betterNumbers,
    betterTiming,
    getEstimationColor,
    getPercentage,
    getPercentageColor,
    truncateText
} from "../utils";
import NodeTable from "./NodeTable";
import {NodeScopes, PlanRow} from "../types";
import NodePopover from "./NodePopover";
import {ExpandMore} from "../ExpandMore";

interface NodeProps {
    data: PlanRow
    theme: any
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
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

function showTimingChip(percentage: number): boolean {
    return percentage > 15
}

function showRowEstimationChip(factor: number): boolean {
    return factor > 10
}

const Node = ({data, theme}: NodeProps) => {
    const [expanded, setExpanded] = useState(false);
    const exclusiveTimeColor = getPercentageColor(data.exclusive, data.execution_time, theme);
    const exclusiveTimePercentage = getPercentage(data.exclusive, data.execution_time);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <MainCard contentSX={{p: 1.5}} sx={{width: 'auto', minWidth: theme.diagram.node.width}} boxShadow>
            <Stack spacing={0.5}>

                <Grid container alignItems="center">
                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <DownOutlined style={{fontSize: '10px'}}/>
                    </ExpandMore>
                    <Typography variant="h5" color="bold">
                        {data.operation}
                    </Typography>
                    <Grid item>
                        {showTimingChip(getPercentage(data.exclusive, data.execution_time)) && (
                            <Chip
                                style={{backgroundColor: exclusiveTimeColor}}
                                icon={<FieldTimeOutlined style={{fontSize: '0.75rem', color: 'inherit'}}/>}
                                label={`${betterTiming(data.exclusive)}`}
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
                                label={`${betterNumbers(data.rows.estimation_factor)}`}
                                sx={{ml: 1.25, pl: 1}}
                                size="small"
                            />
                        )}
                        <a href={`/plan#${data.node_id}`}>
                            <Chip
                                style={{backgroundColor: theme.palette.secondary["A100"]}}
                                icon={<SelectOutlined style={{fontSize: '0.75rem', color: 'inherit'}}/>}
                                sx={{ml: 1.25, pl: 1}}
                                size="medium"
                            />
                        </a>
                    </Grid>
                </Grid>
            </Stack>
            {showTimingChip(exclusiveTimePercentage) && (
                <Box sx={{pt: 1, pb: 1}}>
                    <LinearProgressWithLabel cellWarningColor={exclusiveTimeColor} theme={theme} value={exclusiveTimePercentage}/>
                </Box>
            )}

            <Box sx={{pt: 1}}>
                <Typography sx={{color: `${exclusiveTimeColor || 'primary'}.main`}}>
                    Rows returned: {` `}
                    <b>{betterNumbers(data.rows.total)}</b>
                </Typography>{' '}
            </Box>
            <Box sx={{pt: 1, pb: 0}}>
                <Divider/>
            </Box>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent sx={{p: 0.2}}>
                    <Box sx={{pt: 1}}>
                        {Object.keys(data.scopes).map(scopeName => (
                            data.scopes[scopeName] && <NodePopover
                                component={
                                    <Typography><b>{scopeName} </b>{truncateText(data.scopes[scopeName], theme.diagram.text.maxChars)}
                                    </Typography>
                                }
                                text={data.scopes[scopeName]}
                            >
                                <Typography><b>{scopeName} </b>{data.scopes[scopeName]}</Typography>
                            </NodePopover>
                        ))}
                        {data.scopes.filters !== "" && (
                            <p style={{margin: 0}}><b>rows removed by filters: </b>{betterNumbers(data.rows.removed)},
                                ({Math.round(getPercentage(data.rows.removed, data.rows.total))} %)</p>
                        )}
                    </Box>
                    <Box sx={{pt: 1, pb: 0}}>
                        <Divider/>
                    </Box>

                    <Box sx={{pt: 1}}>
                        <NodeTable buffers={data.buffers}/>
                    </Box>
                </CardContent>
            </Collapse>
        </MainCard>
    );
};

export default Node;