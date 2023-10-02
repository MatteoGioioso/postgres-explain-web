import {Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import React, {useState} from "react";
import {TopQueriesByFingerprintTableData, TopQueriesTableData} from "../../SelfHosted/services/Activities.service";
import {MetricInfo} from "../../SelfHosted/proto/analytics.pb";
import {MouseOverPopover} from "../GenericDetailsPopover";
import Plot from 'react-plotly.js';
import {getMetricsColumns, getPopupWaitEventsSummary, Metric, metricsInfoMap, PopupWaitEventsSummary} from "./utils";
import {formatNumbers, truncateText} from "../utils";
import {CustomToolTip, InfoToolTip} from "../CustomTooltips";
import {onClickExplainTopQuery, QueryModal} from "./QueryModal";
import {Instance} from "../../SelfHosted/proto/info.pb";
import {StopOutlined, WarningOutlined, ZoomInOutlined} from "@ant-design/icons";
import {useTheme} from "@mui/material/styles";
import {ButtonAction, ButtonLink} from "../Buttons";
import {useParams} from "react-router-dom";
import {Head, QueryLoadCell, QueryTextCell, TableWrapper} from "./TableSharedComponents";


interface TopQueriesByFingerprintTableProps {
    tableDataArray: readonly TopQueriesByFingerprintTableData[]
    onClickExplainTopQuery: onClickExplainTopQuery
    clusterInstancesList: Instance[]
}

export function TopQueriesByFingerprintTable({
                                                 tableDataArray,
                                                 onClickExplainTopQuery,
                                                 clusterInstancesList
                                             }: TopQueriesByFingerprintTableProps) {
    return (
        <>
            <TableWrapper sx={{height: '30vh'}}>
                <TableHead>
                    <TableRow>
                        <Head mapping={{key: 'Load by wait events (Active Average Session)', Title: 'Load'}}/>
                        <Head mapping={{key: 'SQL statement', Title: 'SQL'}}/>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableDataArray.map((tableData) => {
                        return (
                            <Row
                                key={tableData.query_sha}
                                tableData={tableData}
                                onClickExplainTopQuery={onClickExplainTopQuery}
                                clusterInstancesList={clusterInstancesList}
                            />
                        )
                    })}
                </TableBody>
            </TableWrapper>
        </>
    );
}

interface RowProps {
    tableData: TopQueriesByFingerprintTableData
    onClickExplainTopQuery: onClickExplainTopQuery
    clusterInstancesList: Instance[]
}

function Row({tableData, onClickExplainTopQuery, clusterInstancesList}: RowProps) {
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
                key={tableData.query_sha}
            >
                <QueryLoadCell tableData={tableData}/>
                <QueryTextCell tableData={tableData} handleOpenQueryModel={handleOpen}/>
            </TableRow>
        </>
    )
}