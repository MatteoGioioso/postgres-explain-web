import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {betterNumbers} from "../utils";

export default function NodeTable({buffers}) {
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
                            key={'buffers'}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell sx={{p: 0.2, fontSize: 12}} component="th" scope="row">
                                Blocks:
                            </TableCell>
                            <TableCell sx={{p: 0.2, fontSize: 12}} align="right">{betterNumbers(buffers.reads)}</TableCell>
                            <TableCell sx={{p: 0.2, fontSize: 12}} align="right">{betterNumbers(buffers.written)}</TableCell>
                            <TableCell sx={{p: 0.2, fontSize: 12}} align="right">{betterNumbers(buffers.hits)}</TableCell>
                        </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}