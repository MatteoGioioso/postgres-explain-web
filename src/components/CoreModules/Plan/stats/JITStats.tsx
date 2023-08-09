import MainCard from "../../MainCard";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import React from "react";
import {Stats} from "../types";
import {betterDiskSizeFromBlocks, betterNumbers, betterTiming, capitalizeFirstLetter} from "../../utils";

export interface JITStatsTableProps {
    stats: Stats
}

export const JITStatsTable = ({stats}: JITStatsTableProps) => {
    return (
        <MainCard content={false} sx={{width: '50vw'}}>
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
                                    sx={{pt: 1.5, pb: 1.5}}
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

const Row = ({name, data}: { name: string, data: number }) => {
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
                <b>{getMeasure(formattedName, data)}</b>
            </TableCell>
            <TableCell>
                {data}
            </TableCell>
        </TableRow>
    )
}

const headCells = (areBuffersPresent?: boolean) => [
    {
        id: 'name',
        label: 'Name',
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
        return betterDiskSizeFromBlocks(data)
    }

    return betterNumbers(data)
}