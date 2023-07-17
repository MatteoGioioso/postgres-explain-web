// material-ui
import {
    Box,
    CardActions,
    CardContent,
    Chip,
    Collapse,
    Divider,
    Grid,
    IconButton,
    IconButtonProps, LinearProgress,
    Stack,
    styled,
    Typography
} from '@mui/material';
// project import
import MainCard from '../MainCard';

// assets
import {RiseOutlined, FallOutlined, DownOutlined, FieldTimeOutlined} from '@ant-design/icons';
import React, {useState} from "react";
import {
    betterNumbers,
    areRowsOverEstimated,
    getPercentageColor,
    getPercentage,
    truncateText,
    betterTiming,
    getEstimationColor
} from "../utils";
import NodeTable from "./NodeTable";
import {PlanRow} from "../types";

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

interface NodeProps {
    data: PlanRow
    theme: any
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const {expand, ...other} = props;
    return <IconButton {...other} />;
})(({theme, expand}) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

function showTimingChip(percentage: number): boolean {
    return percentage > 15
}

function showRowEstimationChip(factor: number): boolean {
    return factor > 10
}

const Node = ({data, theme}: NodeProps) => {
    const [expanded, setExpanded] = useState(false);
    const cellWarningColor = getPercentageColor(data.exclusive, data.execution_time, theme);
    const perc = getPercentage(data.exclusive, data.execution_time);
    const isLoss = areRowsOverEstimated(data.rows.estimation_direction)

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
                        {data.node.operation}
                    </Typography>
                    <Grid item>
                        {showTimingChip(getPercentage(data.exclusive, data.execution_time)) && (
                            <Chip
                                style={{backgroundColor: cellWarningColor}}
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

                    </Grid>
                </Grid>
            </Stack>
            {showTimingChip(perc) && (
                <Box sx={{pt: 1, pb: 1}}>
                    <LinearProgress sx={{
                        backgroundColor: theme.palette.secondary.lighter,
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: cellWarningColor
                        }
                    }} variant="determinate" value={perc}/>
                </Box>
            )}

            <Box sx={{pt: 1}}>
                <Typography variant="caption">
                    <Typography variant="caption" sx={{color: `${cellWarningColor || 'primary'}.main`}}>
                        Rows returned: {` `}
                        <b>{betterNumbers(data.rows.total)}</b>
                    </Typography>{' '}
                </Typography>
            </Box>
            <Box sx={{pt: 1, pb: 0}}>
                <Divider/>
            </Box>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent sx={{p: 0.2}}>
                    <Typography paragraph>
                        {data.node.scope && (<p style={{margin: 0}}><b>on </b><code>{truncateText(data.node.scope, 10000)}</code></p>)}
                        {data.node.index && (<p style={{margin: 0}}><b>by </b><code>{truncateText(data.node.index, 10000)}</code></p>)}
                        {data.node.filters && (
                            <p style={{margin: 0}}><b>filter by </b><code>{truncateText(data.node.filters, 10000)}</code></p>)}
                    </Typography>
                    <NodeTable buffers={data.buffers}/>
                </CardContent>
            </Collapse>
        </MainCard>
    );
};

export default Node;