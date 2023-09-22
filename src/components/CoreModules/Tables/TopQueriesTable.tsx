import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import React from "react";
import {TableData, TopQueriesTableData} from "../../SelfHosted/services/Activities.service";
import {MetricInfo} from "../../SelfHosted/proto/analytics.pb";
import {GenericDetailsPopover} from "../GenericDetailsPopover";
import Plot from 'react-plotly.js';
import Highlight from 'react-highlight'
import {getMetricsColumns, getMetricsKeys, Metric, metricsInfoMap} from "./utils";
import {truncateText} from "../utils";
import {TextTooltip} from "../CustomTooltips";


interface TopQueriesTableProps {
    tableDataArray: readonly TopQueriesTableData[],
    isLoading?: boolean,
    onQueryDetailsPanelToggle?: any,
    topQueryTableSelectedItems?: any,
    onTopQueryTableSelectItems?: any
}

export function TopQueriesTable({tableDataArray}: TopQueriesTableProps) {
    return (
        <>
            <TableContainer
                sx={{
                    height: '40vh',
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
                            <Head mapping={{key: 'load', Title: 'Load'}}/>
                            <Head mapping={{key: 'sql', Title: 'SQL'}}/>
                            {Object.values(metricsInfoMap).map((metric: Metric) => (
                                <Head mapping={{key: metric.key, Title: metric.title}}/>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableDataArray.map((tableData) => {
                            return <Row tableData={tableData}/>
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

interface RowProps {
    tableData: TopQueriesTableData
}

function Row({tableData}: RowProps) {
    return (
        <TableRow
            hover
            role="checkbox"
            sx={{'&:last-child td, &:last-child th': {border: 0}}}
            tabIndex={-1}
            key={tableData.id}
        >
            <TableCell>
                <Plot
                    data={tableData.aas.data}
                    layout={tableData.aas.layout}
                    config={{displayModeBar: false}}
                    // style={{width: '50%'}}
                    // onClick={(data) => {
                    //     const map = data.points.filter(d => d.x !== 0).map(d => ({
                    //         x: d.x,
                    //         color: d.data.marker.color,
                    //         name: d.data.name
                    //     }));
                    //     setPopData(map)
                    // }}
                />
            </TableCell>
            <TableCell>
                <code>
                    <TextTooltip text={tableData.name} maxChar={60} />
                </code>
            </TableCell>
            {getMetricsColumns(tableData).map(val => (
                <TableCell>
                    {val}
                </TableCell>
            ))}
        </TableRow>
    )
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