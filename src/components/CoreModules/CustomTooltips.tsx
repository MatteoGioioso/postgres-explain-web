import {Tooltip, Typography} from "@mui/material";
import React from "react";
import {formatBigNumbers, formatNumbers, formatTiming, truncateText} from "./utils";
import {useTheme} from "@mui/material/styles";

interface CustomTooltipProps {
    text: string
}

export const TextTooltip = ({text, ...props}: CustomTooltipProps) => {
    const theme = useTheme();
    return (
        <Tooltip
            arrow
            title={text}
            {...props}
        >
            {/* @ts-ignore */}
            {getTooltipContent(truncateText(text, theme.diagram.text.maxChar), true)}
        </Tooltip>
    )
}

interface NumberTooltipProps {
    number: number
}

export const NumberTooltip = ({number, ...props}: NumberTooltipProps) => {
    const MIN_NUMBER = 999
    return (
        <Tooltip
            disableHoverListener={number < MIN_NUMBER}
            arrow
            title={formatBigNumbers(number)}
            {...props}
        >
            {getTooltipContent(formatNumbers(number), number > MIN_NUMBER)}
        </Tooltip>
    )
}

export const TimingTooltip = ({number, ...props}: NumberTooltipProps) => {
    const MIN_MILLIS = 999
    return (
        <Tooltip
            disableHoverListener={number < MIN_MILLIS}
            arrow
            title={`${formatBigNumbers(number)} ms`}
            {...props}
        >
            {getTooltipContent(formatTiming(number), number > MIN_MILLIS)}
        </Tooltip>
    )
}

function getTooltipContent(children: any, isEnabled: boolean) {
    return <Typography
        component='span'
        sx={{
            cursor: isEnabled && 'pointer',
            textDecoration: isEnabled && 'underline',
            width: 'fit-content',
            textDecorationColor: theme => theme.palette.secondary.light
        }}
    >
        {children}
    </Typography>;
}
