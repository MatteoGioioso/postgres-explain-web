import React from "react";
import {Popover, TableCell} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {betterNumbers, getPercentageColor} from "../utils";

export const GenericDetailsPopover = (props: { name: string, content: any, children: string }) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            {props.children}
            <Popover
                id="mouse-over-popover"
                sx={{
                    pointerEvents: 'none',
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                {props.content}
            </Popover>
        </>
    )
}

export const getRowEstimateDirectionSymbol = (direction: string): string => {
    switch (direction) {
        case 'over':
            return '↑'
        case 'under':
            return '↓'
        default:
            return ''
    }
}

export const ComparatorCell = ({prop, totalProp, name}: { prop: number, totalProp: number, name?: string }) => {
    const theme = useTheme();
    return (
        <TableCell
            component="th"
            style={{
                color: '#2f2f2f',
                backgroundColor: getPercentageColor(prop, totalProp, theme)
            }}>
            {betterNumbers(prop)}
        </TableCell>
    )
}

export const headCells = [
    {
        id: 'exclusive',
        label: 'Time',
        align: 'left',
        disablePadding: false,
    },
    {
        id: 'inclusive',
        label: 'Cumulative Time',
        align: 'left',
        disablePadding: false,
    },
    {
        id: 'rows',
        label: 'Rows',
        align: 'left',
        disablePadding: false,
    },
    {
        id: 'rows-removed',
        label: 'Rows Removed',
        align: 'left',
        disablePadding: false,
    },
    {
        id: 'rows_x',
        label: 'Rows E',
        align: 'left',
        disablePadding: false,
    },
    {
        id: 'loops',
        label: 'Loops',
        align: 'left',
        disablePadding: false,
    },
    {
        id: 'node',
        label: 'Node',
        align: 'left',
        disablePadding: false,
    },
]