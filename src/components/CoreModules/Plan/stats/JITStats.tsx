import MainCard from "../../MainCard";
import {Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import React from "react";
import {JIT} from "../types";
import {betterDiskSizeFromBlocks, betterNumbers, betterTiming, capitalizeFirstLetter, getPercentageColor} from "../../utils";

export interface JITStatsTableProps {
    stats: JIT
    executionTime: number
}

export const JITStatsTable = ({stats, executionTime}: JITStatsTableProps) => {
    return (
        <MainCard content={false} sx={{width: '40vw'}}>
            <TableContainer
                sx={{
                    '& td, & th': {whiteSpace: 'nowrap'},
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
                            <TableCell
                                sx={{pt: 1.5, pb: 1.5}}
                            >
                                <Typography variant='h4'>
                                    JIT
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(stats).map((s) => {
                            return <Row name={s} data={stats[s]} executionTime={executionTime}/>
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </MainCard>
    )
}

const Row = ({name, data, executionTime}: { name: string, data: any, executionTime: number }) => {
    return (
        <TableRow
            sx={{'&:last-child td, &:last-child th': {border: 0}}}
            key={name}
            id={name}
        >
            <TableCell>
                <Stack direction='row'>
                    <Typography variant='h5'>
                        {name}:
                    </Typography>
                    <Box sx={{pl: 2}}>{name === "Functions" && data}</Box>
                </Stack>
                <TableBody>
                    {Object.keys(data).map(k => (
                        <TableRow>
                            <TableCell>
                                <Typography variant='h5'>
                                    {k}:
                                </Typography>
                            </TableCell>
                            <TableCell
                                sx={{backgroundColor: (theme) => isTiming(data[k]) ? getPercentageColor(data[k], executionTime, theme) : 'inherit'}}>
                                {isTiming(data[k]) ? data[k].toString() : betterTiming(data[k])}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </TableCell>
        </TableRow>
    )
}

function isTiming(value: number | boolean): boolean {
    return typeof value !== "boolean"
}