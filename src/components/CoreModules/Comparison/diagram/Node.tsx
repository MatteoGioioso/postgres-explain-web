import {
    Box,
    Chip,
    Grid,
    LinearProgress,
    LinearProgressProps,
    Stack,
    Typography,
} from '@mui/material';
import {
    DollarOutlined,
    FallOutlined,
    FieldTimeOutlined, ForkOutlined,
    RiseOutlined, TableOutlined,
} from '@ant-design/icons';
import React, {useContext} from "react";
import {
    areRowsOverEstimated,
    betterNumbers, betterTiming,
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

function LinearProgressWithLabel(props: LinearProgressProps & { value: number, time: number, theme: any, cellWarningColor: string }) {
    return (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Box sx={{width: '75%', mr: 1, position: 'relative'}}>
                <LinearProgress variant="determinate" {...props} sx={{
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
        const exclusiveTimeColor = getPercentageColor(data.exclusive, data.execution_time, theme);
        const exclusiveTimePercentage = getPercentage(data.exclusive, data.execution_time);

        return (
            <div
                id={`node_${data.node_id}`}
            >
                {/*<MainCard*/}
                {/*    border*/}
                {/*    boxShadow*/}
                {/*>*/}
                {/*    <Stack spacing={0.5}>*/}

                {/*        <Grid container alignItems="center">*/}
                <Typography variant="subtitle2" color="bold">
                    {data.operation}
                </Typography>
                {/*<Grid item>*/}
                {/*    {Boolean(data.workers.launched) && (*/}
                {/*        <Chip*/}
                {/*            style={{backgroundColor: theme.palette.primary['100']}}*/}
                {/*            icon={<ForkOutlined style={{fontSize: '0.75rem', color: 'inherit'}}/>}*/}
                {/*            sx={{ml: 1.25, pl: 1}}*/}
                {/*            label={data.workers.launched + 1}*/}
                {/*            size="small"*/}
                {/*        />*/}
                {/*    )}*/}
                {/*    {showChipsBasedOnPercentage(getPercentage(data.exclusive, data.execution_time)) && (*/}
                {/*        <Chip*/}
                {/*            style={{backgroundColor: exclusiveTimeColor}}*/}
                {/*            icon={<FieldTimeOutlined style={{fontSize: '0.75rem', color: 'inherit'}}/>}*/}
                {/*            sx={{ml: 1.25, pl: 1}}*/}
                {/*            size="small"*/}
                {/*        />*/}
                {/*    )}*/}
                {/*    {showChipsBasedOnPercentage(getPercentage(data.costs.total_cost, stats.max_cost)) && (*/}
                {/*        <Chip*/}
                {/*            style={{backgroundColor: getPercentageColor(data.costs.total_cost, stats.max_cost, theme)}}*/}
                {/*            icon={<DollarOutlined style={{fontSize: '0.75rem', color: 'inherit'}}/>}*/}
                {/*            sx={{ml: 1.25, pl: 1}}*/}
                {/*            size="small"*/}
                {/*        />*/}
                {/*    )}*/}
                {/*    {showRowEstimationChip(data.rows.estimation_factor) && (*/}
                {/*        <Chip*/}
                {/*            style={{backgroundColor: getEstimationColor(data.rows.estimation_factor, theme)}}*/}
                {/*            icon={*/}
                {/*                <>*/}
                {/*                    {areRowsOverEstimated(data.rows.estimation_direction) ?*/}
                {/*                        <RiseOutlined style={{fontSize: '0.75rem', color: 'inherit'}}/> :*/}
                {/*                        <FallOutlined style={{fontSize: '0.75rem', color: 'inherit'}}/>*/}
                {/*                    }*/}
                {/*                </>*/}
                {/*            }*/}
                {/*            sx={{ml: 1.25, pl: 1}}*/}
                {/*            size="small"*/}
                {/*        />*/}
                {/*    )}*/}
                {/*    {data.sub_plan_of && (*/}
                {/*        <Chip*/}
                {/*            style={{backgroundColor: theme.palette.secondary.light}}*/}
                {/*            sx={{ml: 1.25}}*/}
                {/*            size="small"*/}
                {/*            label="CTE"*/}
                {/*        />*/}
                {/*    )}*/}
                {/*</Grid>*/}
                {/*    </Grid>*/}
                {/*</Stack>*/}
                {/*<Box sx={{pt: 2, pb: 2}}>*/}
                {/*    <LinearProgressWithLabel*/}
                {/*        cellWarningColor={exclusiveTimeColor}*/}
                {/*        theme={theme}*/}
                {/*        value={exclusiveTimePercentage}*/}
                {/*        time={data.exclusive}*/}
                {/*    />*/}
                {/*</Box>*/}
                {/*<Box sx={{pt: 1}}>*/}
                {/*    <Typography sx={{color: `${exclusiveTimeColor || 'primary'}.main`}}>*/}
                {/*        Rows returned: {` `}*/}
                {/*        <b>{betterNumbers(data.rows.total * (data.workers.launched + 1))}</b>*/}
                {/*    </Typography>{' '}*/}
                {/*</Box>*/}
                {/*</MainCard>*/}
            </div>
        );
    }
;

export default Node;