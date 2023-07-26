import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {betterNumbers} from "../utils";
import {Buffers} from "../types";

export default function NodeTable({buffers}: { buffers: Buffers }) {
    return (
        <TableContainer>
            <Table size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{p: 0, fontSize: 12}}></TableCell>
                        <TableCell sx={{p: 0, fontSize: 12}} align="right">Reads</TableCell>
                        <TableCell sx={{p: 0, fontSize: 12}} align="right">Written</TableCell>
                        <TableCell sx={{p: 0, fontSize: 12}} align="right">Hits</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow
                        key={'shared'}
                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    >
                        <TableCell sx={{p: 0.2, fontSize: 12}} component="th" scope="row">
                            Shared:
                        </TableCell>
                        <TableCell sx={{p: 0.2, fontSize: 12}} align="right">{betterNumbers(buffers.exclusive_reads)}</TableCell>
                        <TableCell sx={{p: 0.2, fontSize: 12}} align="right">{betterNumbers(buffers.exclusive_written)}</TableCell>
                        <TableCell sx={{p: 0.2, fontSize: 12}} align="right">{betterNumbers(buffers.exclusive_hits)}</TableCell>
                    </TableRow>
                    <TableRow
                        key={'temp'}
                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    >
                        <TableCell sx={{p: 0.2, fontSize: 12}} component="th" scope="row">
                            Temp:
                        </TableCell>
                        <TableCell sx={{p: 0.2, fontSize: 12}} align="right">{betterNumbers(buffers.exclusive_temp_reads)}</TableCell>
                        <TableCell sx={{p: 0.2, fontSize: 12}} align="right">{betterNumbers(buffers.exclusive_temp_written)}</TableCell>
                        <TableCell sx={{p: 0.2, fontSize: 12}} align="right">-</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}