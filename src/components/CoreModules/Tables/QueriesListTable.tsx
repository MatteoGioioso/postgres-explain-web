import React, {useEffect, useState} from 'react'
import {
    Box,
    Button, Grid,
    Modal, Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow,
    TextField,
    Typography
} from '@mui/material'
import Highlight from 'react-highlight'
import {MetricInfo, Query} from "../../SelfHosted/proto/analytics.pb";
import {GenericDetailsPopover} from "../GenericDetailsPopover";
import {truncateText} from "../utils";
import MainCard from "../MainCard";
import {Formik} from "formik";
import {QueryModal} from "./QueryModal";

export interface MetricsTableProps {
    mappings: MetricInfo[]
    queries: Query[]
    onClickRow: any
}

function Head({mapping}: { mapping: MetricInfo }) {
    return (
        <TableCell
            key={mapping.key}
        >
            <GenericDetailsPopover name={"description"} content={mapping.key}>
                {mapping.Title}
            </GenericDetailsPopover>
        </TableCell>
    );
}

const Row = ({query, onClickRow}: { query: Query, onClickRow: any }) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <QueryModal open={open} handleClose={handleClose} tableData={null} onClick={onClickRow} clusterInstancesList={[]}/>
            <TableRow
                hover
                role="checkbox"
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                tabIndex={-1}
                key={query.id}
                onClick={() => {
                    handleOpen()
                }}
            >
                <TableCell>
                    {query.id}
                </TableCell>
                <TableCell>
                    <code>{truncateText(query.text, 50)}</code>
                </TableCell>
                {Object.keys(query.metrics).map((metric, i) => (
                    <TableCell key={i}>
                        {/*{metric.value || "-"}*/}
                    </TableCell>
                ))}
            </TableRow>
        </>
    )
}

export function QueriesListTable({queries, mappings, onClickRow}: MetricsTableProps) {
    return (
        <>
            <TableContainer
                sx={{
                    height: '30vh',
                    width: '100vw',
                    overflowX: 'auto',
                    position: 'relative',
                    display: 'block',
                    maxWidth: '100%',
                    '& td, & th': {whiteSpace: 'nowrap'}
                }}
            >
                <Table
                    stickyHeader
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
                            <Head mapping={{key: 'queryid', Title: 'ID'}}/>
                            <Head mapping={{key: 'query', Title: 'Query'}}/>
                            {mappings.map((mapping) => (
                                <Head mapping={mapping}/>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {queries.map((row) => {
                            return <Row query={row} onClickRow={onClickRow}/>
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
