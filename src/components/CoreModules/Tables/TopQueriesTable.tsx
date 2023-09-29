import {Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import React, {useState} from "react";
import {TopQueriesTableData} from "../../SelfHosted/services/Activities.service";
import {MetricInfo} from "../../SelfHosted/proto/analytics.pb";
import {MouseOverPopover} from "../GenericDetailsPopover";
import Plot from 'react-plotly.js';
import {getMetricsColumns, Metric, metricsInfoMap} from "./utils";
import {formatNumbers, truncateText} from "../utils";
import {CustomToolTip, InfoToolTip} from "../CustomTooltips";
import {onClickExplainTopQuery, QueryModal} from "./QueryModal";
import {Instance} from "../../SelfHosted/proto/info.pb";
import {StopOutlined, WarningOutlined} from "@ant-design/icons";
import {useTheme} from "@mui/material/styles";


interface TopQueriesTableProps {
    tableDataArray: readonly TopQueriesTableData[]
    onClickExplainTopQuery: onClickExplainTopQuery
    clusterInstancesList: Instance[]
}

export function TopQueriesTable({tableDataArray, onClickExplainTopQuery, clusterInstancesList}: TopQueriesTableProps) {
    return (
        <>
            <TableContainer
                sx={{
                    height: '50vh',
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
                            <Head mapping={{key: 'Load by wait events (Active Average Session)', Title: 'Load'}}/>
                            <Head mapping={{key: 'SQL statement', Title: 'SQL'}}/>
                            {Object.values(metricsInfoMap).map((metric: Metric) => (
                                <Head mapping={{key: metric.key, Title: metric.title}}/>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableDataArray.map((tableData) => {
                            return (
                                <Row
                                    key={tableData.fingerprint}
                                    tableData={tableData}
                                    onClickExplainTopQuery={onClickExplainTopQuery}
                                    clusterInstancesList={clusterInstancesList}
                                />
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

interface RowProps {
    tableData: TopQueriesTableData
    onClickExplainTopQuery: onClickExplainTopQuery
    clusterInstancesList: Instance[]
}

function Row({tableData, onClickExplainTopQuery, clusterInstancesList}: RowProps) {
    const theme = useTheme();
    const [popData, setPopData] = useState<Array<{ name: string, x: number, color: string }>>([{color: "", x: 0, name: ""}]);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <QueryModal
                open={open}
                handleClose={handleClose}
                tableData={tableData}
                onClick={onClickExplainTopQuery}
                clusterInstancesList={clusterInstancesList}
            />
            <TableRow
                hover
                role="checkbox"
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                tabIndex={-1}
                key={tableData.fingerprint}
            >
                <TableCell
                    onMouseEnter={() => {
                        const map = tableData.aas.data
                            .filter(d => d.x[0] !== 0)
                            .map(d => ({
                                x: d.x,
                                color: d.marker.color,
                                name: d.name
                            }))
                            .sort(function (a, b) {
                                // @ts-ignore
                                return b.x - a.x;
                            });
                        setPopData(map as any)
                    }}
                >
                    <Stack direction='row' spacing={1}>
                        <MouseOverPopover
                            name={"summary"}
                            content={
                                popData.map(d => (
                                    <div key={d.name} style={{color: d.color}}>&#9632;
                                        <p style={{
                                            color: '#2f2f2f',
                                            display: "inline"
                                        }}>{d.name}: {formatNumbers(d.x)}</p>
                                    </div>
                                ))}
                        >
                            <Plot
                                data={tableData.aas.data}
                                layout={tableData.aas.layout}
                                config={{displayModeBar: false}}
                                style={{width: tableData.aas.upperRange * 4}}
                            />
                        </MouseOverPopover>
                        <Typography>
                            {formatNumbers(tableData.aas.total)}
                        </Typography>
                    </Stack>
                </TableCell>
                <TableCell
                    onClick={() => !tableData.isNotExplainable && handleOpen()}
                >
                    {!tableData.isNotExplainable || (
                        <>
                            <CustomToolTip
                                text={""}
                                maxChar={0}
                                info={"Query cannot be explained"}
                                children={<StopOutlined style={{color: theme.palette.error.main, fontSize: '0.8rem'}}/>}
                            />
                            <Box sx={{pr: 2, display: 'inline'}}/>
                        </>
                    )}
                    {!tableData.isTruncated || (
                        <>
                            <CustomToolTip
                                text={""}
                                maxChar={0}
                                info={"Query is truncated"}
                                children={<WarningOutlined style={{color: theme.palette.warning.light, fontSize: '0.8rem'}}/>}
                            />
                            <Box sx={{pr: 2, display: 'inline'}}/>
                        </>
                    )}
                    <CustomToolTip text={""} maxChar={0} info={tableData.name} children={<code>{truncateText(tableData.name, 60)}</code>}/>
                </TableCell>
                {getMetricsColumns(tableData).map(col => (
                    <TableCell key={tableData.fingerprint + col.key}>
                        {col.val}
                    </TableCell>
                ))}
            </TableRow>
        </>
    )
}

function Head({mapping}: { mapping: MetricInfo }) {
    return (
        <TableCell
            key={mapping.key}
        >
            <InfoToolTip info={mapping.key} text={mapping.Title} maxChar={20}/>
        </TableCell>
    );
}