import {QueryPlanListItem} from "../types";
import ReactApexChart from 'react-apexcharts';
import {useTheme} from '@mui/material/styles';
import React, {useState, useEffect} from 'react';
import {ApexOptions} from "apexcharts";
import MainCard from "../MainCard";
import {
    areRowsOverEstimated,
    betterDate,
    betterNumbers,
    betterTiming,
    getEstimationColor,
    getPercentage,
    getPercentageColor
} from "../utils";
import {renderToString} from 'react-dom/server'
import {Box, Chip, Grid, Stack, Typography} from "@mui/material";
import {useParams} from "react-router-dom";


interface OptimizationsAnalyticsProps {
    optimizations: QueryPlanListItem[]
}

export const OptimizationsAnalytics = ({optimizations}: OptimizationsAnalyticsProps) => {
    return (
        <OptimizationChart optimizations={optimizations}/>
    )
}


const areaChartOptions = {
    chart: {
        height: 450,
        type: 'area',
        toolbar: {
            show: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth',
        width: 2
    },
    grid: {
        strokeDashArray: 0
    },
};

// ==============================|| INCOME AREA CHART ||============================== //

const OptimizationChart = ({optimizations}: OptimizationsAnalyticsProps) => {
    const theme = useTheme();
    const {plan_id} = useParams();

    const {primary, secondary} = theme.palette.text;
    const line = theme.palette.divider;

    const [options, setOptions] = useState(areaChartOptions);

    useEffect(() => {
        // @ts-ignore
        setOptions((prevState) => ({
            ...prevState,
            colors: [theme.palette.primary.main],
            xaxis: {
                categories: optimizations.map(opt => betterDate(opt.period_start)),
                axisBorder: {
                    show: true,
                    color: line
                },
                tickAmount: optimizations.length
            },
            yaxis: {
                labels: {
                    style: {
                        colors: [secondary]
                    }
                }
            },
            grid: {
                borderColor: line
            },
            tooltip: {
                theme: 'light',
                custom({series, seriesIndex, dataPointIndex, w}) {
                    return renderToString(
                        <OptimizationToolTip
                            optimizations={optimizations}
                            series={series}
                            dataPointIndex={dataPointIndex}
                            seriesIndex={seriesIndex}
                            w={w}/>
                    )
                }
            },
            annotations: {
                xaxis: [{
                    x: betterDate(optimizations.find(opt => opt.id === plan_id).period_start),
                    borderColor: '#999',
                    yAxisIndex: 0,
                    label: {
                        show: true,
                        text: '<>',
                        style: {
                            color: "#fff",
                            background: theme.palette.primary.main
                        }
                    }
                }]
            },
        }));
    }, [plan_id]);

    const [series, setSeries] = useState([
        {
            name: 'Execution time',
            data: []
        },
    ]);

    useEffect(() => {
        setSeries([
            {
                name: 'Execution time (s)',
                data: optimizations.map(opt => Math.round(opt.executionTime) / 1000)
            },
        ]);
    }, []);

    return (
        <MainCard>
            <ReactApexChart options={options as ApexOptions} series={series} type="line" height={450}/>
        </MainCard>
    );
};


const OptimizationToolTip = ({series, seriesIndex, dataPointIndex, w, optimizations}) => {
    return (
        <Box style={{padding: '10px'}}>
            <Typography variant='h4'>
                {(optimizations as QueryPlanListItem[])[dataPointIndex].id}
            </Typography>
            <Typography variant='body2'>
                Execution time: {betterTiming((optimizations as QueryPlanListItem[])[dataPointIndex].executionTime)}
            </Typography>
        </Box>
    )
}