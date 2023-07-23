import MainCard from "../MainCard";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import React from "react";
import {GenericDetailsPopover,} from "../table/Cells";
import {IndexesStats, IndexStats, Stats} from "../types";
import {betterDiskSize, betterNumbers, betterTiming, capitalizeFirstLetter} from "../utils";

export interface IndexesStatsTableProps {
    stats: IndexesStats
}

export const IndexesStatsTable = ({stats}: IndexesStatsTableProps) => {
    return (
        <MainCard content={false}  sx={{width: '40vw'}}>
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
                            {headCells().map((headCell) => (
                                <TableCell
                                    key={headCell.id}
                                    sx={{fontSize: '18px'}}
                                >
                                    {headCell.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(stats.indexes).map((s) => {
                            return <Row name={s} data={stats.indexes[s]}/>
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </MainCard>
    )
}

const Row = ({name, data}: { name: string, data: IndexStats }) => {
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
                <b>{betterTiming(data.total_time)}</b>
            </TableCell>
            <TableCell>
                0
            </TableCell>
        </TableRow>
    )
}

const headCells = (areBuffersPresent?: boolean) => [
    {
        id: 'name',
        label: 'General Stats',
        align: 'left',
        description: ""
    },
    {
        id: 'formatted',
        label: '',
        align: 'left',
        description: ""
    },
    {
        id: 'full',
        label: '',
        align: 'left',
        description: ""
    },
]

const getMeasure = (name: string, data: number): string => {
    if (name.includes("time") || name.includes("duration")) {
        return betterTiming(data)
    } else if (name.includes("blocks")) {
        return betterDiskSize(data)
    }

    return betterNumbers(data)
}