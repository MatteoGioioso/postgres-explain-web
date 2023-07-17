import React, {useState} from 'react'
import {SummaryTableProps} from './interfaces'
// @ts-ignore
import Highlight from 'react-highlight'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import {headCells} from "./table/Cells";
import {Row} from "./table/Row";


function OrderTableHead({order, orderBy}) {
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}


export function SummaryTable({summary, stats}: SummaryTableProps) {
    const [order] = useState('asc');
    const [orderBy] = useState('trackingNo');


    return (
        <>
            <TableContainer
                sx={{
                    width: '100vw',
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
                    <OrderTableHead order={order} orderBy={orderBy}/>
                    <TableBody>
                        {summary.map((row, index) => {
                            return Row(row);
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
