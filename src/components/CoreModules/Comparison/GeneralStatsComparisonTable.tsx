import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import React from "react";
import {betterDiskSizeFromBlocks, betterNumbers, betterTiming, capitalizeFirstLetter} from "../utils";
import MainCard from "../Plan/MainCard";
import {ComparisonGeneralStats, PropComparison} from "../Plan/types";
import {ArrowDownOutlined, ArrowUpOutlined} from "@ant-design/icons";
import {useTheme} from "@mui/material/styles";

export interface GeneralStatsComparisonTableProps {
    stats: ComparisonGeneralStats
}

export const GeneralStatsComparisonTable = ({stats}: GeneralStatsComparisonTableProps) => {
    return (
        <MainCard content={false} sx={{width: '40vw'}}>
            <TableContainer
                sx={{
                    overflowX: 'auto',
                    position: 'relative',
                    display: 'block',
                    maxWidth: '100%',
                    '& td, & th': {whiteSpace: 'nowrap'}
                }}
            >
                <Table
                    title={"General stats"}
                    aria-labelledby="tableTitle"
                    sx={{
                        '& .MuiTableCell-root:first-of-type': {
                            pl: 2
                        },
                        '& .MuiTableCell-root:last-of-type': {
                            pr: 3
                        }
                    }}
                >
                    <TableHead>
                        <TableRow>
                            {headCells.map((headCell) => (
                                <TableCell
                                    key={headCell.id}
                                >
                                    {headCell.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(stats).map((s) => {
                            return <Row name={s} data={stats[s]}/>
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </MainCard>
    )
}

const Row = ({name, data}: { name: string, data: PropComparison }) => {
    const theme = useTheme();
    // @ts-ignore
    const formattedName = capitalizeFirstLetter(name.replaceAll("_", " "))
    return (
        <TableRow
            hover
            role="checkbox"
            sx={{'&:last-child td, &:last-child th': {border: 0}}}
            tabIndex={-1}
            key={name}
            id={name}
        >
            <TableCell>
                {formattedName}
            </TableCell>
            <TableCell>
                <b>{getMeasure(formattedName, data.previous)}</b>
            </TableCell>
            <TableCell>
                <b>{getMeasure(formattedName, data.optimized)}</b>
            </TableCell>
            <TableCell>
                {data.previous !== data.optimized ? (data.has_improved
                    ? <ArrowUpOutlined style={{color: theme.palette.success.main}}/>
                    : <ArrowDownOutlined style={{color: theme.palette.error.main}}/>
                ): <div>-</div>}
            </TableCell>
            <TableCell>
                {betterNumbers(data.previous - data.optimized)}
            </TableCell>
        </TableRow>
    )
}

const headCells = [
    {
        id: 'name',
        label: 'Stat',
        align: 'left',
        description: ""
    },
    {
        id: 'plan_prev',
        label: 'Current Plan',
        align: 'left',
        description: ""
    },
    {
        id: 'optimized_plan',
        label: 'Optimized plan',
        align: 'left',
        description: ""
    },
    {
        id: 'has_improved',
        label: 'Outcome',
        align: 'left',
        description: ""
    },
    {
        id: 'difference',
        label: 'Difference',
        align: 'left',
        description: ""
    },
]

const getMeasure = (name: string, data: number): string => {
    if (name.includes("time") || name.includes("duration")) {
        return betterTiming(data)
    } else if (name.includes("blocks")) {
        return betterDiskSizeFromBlocks(data)
    }

    return betterNumbers(data)
}