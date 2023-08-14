import React, {useEffect, useState} from "react";
import {useTheme} from "@mui/material/styles";
import MainCard from "../../MainCard";
import {
    Box,
    Chip,
    Collapse,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {
    betterDiskSizeFromBlocks,
    betterNumbers,
    betterTiming, getEstimationColor,
    getPercentage,
    getPercentageColor
} from "../../utils";
import {
    BufferHitsCellCollapsedContent,
    BufferReadsCellCollapsedContent,
    BufferWrittenCellCollapsedContent, getRowEstimateDirectionSymbol,
    NodeStats,
    RowsCellCollapsedContent,
} from "../table/Cells";
import {ExpandMore} from "../ExpandMore";
import {CloseOutlined, DownOutlined, WarningOutlined} from "@ant-design/icons";
import {useFocus} from "../hooks";
import {GenericDetailsPopover} from "../../GenericDetailsPopover";
import {queryExplainerService} from "../../../Web/ioc";
import {useParams} from "react-router-dom";
import {NodeData} from "../Contexts";

export const DetailsTable = () => {
    const theme = useTheme();
    const {plan_id} = useParams();
    const [data, setData] = useState<NodeData>()
    const {closeFocusNavigation, focusedNodeId} = useFocus();

    useEffect(() => {
        if (focusedNodeId) {
            setData(queryExplainerService.getQueryPlanNode(plan_id, focusedNodeId))
        } else {
            setData(null)
        }
    }, [focusedNodeId])

    return (
        <Collapse in={Boolean(data)} orientation='horizontal' unmountOnExit mountOnEnter>
            {Boolean(data) && (
                <MainCard content={false} sx={{width: 'auto', minWidth: '20vw'}}>
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
                                <TableCell sx={{maxWidth: '50px'}}>
                                    <Stack direction='row' justifyContent='space-between' spacing={3}>
                                        <Typography variant="h4">{data.row.operation}</Typography>
                                        <IconButton onClick={closeFocusNavigation}>
                                            <CloseOutlined style={{fontSize: '0.90rem', color: 'inherit'}}/>
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableHead>
                            <TableBody>
                                <TableRow
                                    tabIndex={-1}
                                    key={"node"}
                                    id={"node"}
                                >
                                    <TableCell
                                        style={{backgroundColor: getPercentageColor(data.row.exclusive, data.stats.execution_time, theme)}}>
                                        <b>Time:</b> {` `}
                                        {betterTiming(data.row.exclusive)}
                                    </TableCell>
                                </TableRow>

                                <TableRow
                                    tabIndex={-1}
                                    key={"node"}
                                    id={"node"}
                                >
                                    <TableCell
                                        style={{backgroundColor: getPercentageColor(data.row.inclusive, data.stats.execution_time, theme)}}>
                                        <b>Cumulative time:</b> {` `}
                                        {betterTiming(data.row.inclusive)}
                                    </TableCell>
                                </TableRow>


                                <Row
                                    name="Rows"
                                    mainValue={betterNumbers(data.row.rows.total)}
                                    color={getEstimationColor(data.row.rows.estimation_factor, theme)}
                                    showWarning={data.row.rows.estimation_factor >= 100}
                                >
                                    <RowsCellCollapsedContent row={data.row} expanded={true} stats={data.stats} theme={theme}/>
                                    <b>Rows estimation:</b> {` `}
                                    {getRowEstimateDirectionSymbol(data.row.rows.estimation_direction) + ' '}
                                    <GenericDetailsPopover
                                        content={Math.round(data.row.rows.estimation_factor * 1000) / 1000}
                                        name="Rows estimate factor"
                                    >
                                        {betterNumbers(data.row.rows.estimation_factor)}
                                    </GenericDetailsPopover>
                                </Row>

                                {data.row.does_contain_buffers && (
                                    <>
                                        <Row
                                            name="Reads"
                                            color={getPercentageColor(data.row.buffers.effective_blocks_read, data.stats.max_blocks_read, theme)}
                                            mainValue={betterDiskSizeFromBlocks(data.row.buffers.effective_blocks_read)}
                                            showWarning={getPercentage(data.row.buffers.effective_blocks_read, data.stats.max_blocks_read) >= 25}
                                        >
                                            <BufferReadsCellCollapsedContent row={data.row} expanded={true} stats={data.stats}
                                                                             theme={theme}/>
                                        </Row>

                                        <Row
                                            name="Written"
                                            color={getPercentageColor(data.row.buffers.effective_blocks_written, data.stats.max_blocks_written, theme)}
                                            mainValue={betterDiskSizeFromBlocks(data.row.buffers.effective_blocks_written)}
                                            showWarning={getPercentage(data.row.buffers.effective_blocks_written, data.stats.max_blocks_written) > 25}
                                        >
                                            <BufferWrittenCellCollapsedContent row={data.row} expanded={true} stats={data.stats}
                                                                               theme={theme}/>
                                        </Row>

                                        <Row
                                            name="Cache"
                                            mainValue={betterDiskSizeFromBlocks(data.row.buffers.effective_blocks_hits)}
                                        >
                                            <BufferHitsCellCollapsedContent row={data.row} expanded={true} stats={data.stats}
                                                                            theme={theme}/>
                                        </Row>
                                    </>
                                )}

                                <Row name="Info">
                                    <NodeStats row={data.row} expanded={true} stats={data.stats} theme={theme}/>
                                </Row>

                            </TableBody>
                        </Table>
                    </TableContainer>
                </MainCard>
            )}
        </Collapse>
    )
}

const Row = (props) => {
    const [expanded, setExpanded] = useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <TableRow
            tabIndex={-1}
            key={"node"}
            id={"node"}
        >
            <TableCell>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <DownOutlined style={{fontSize: '10px'}}/>
                </ExpandMore>
                <b>{props.name}</b>
                {props.showWarning && (
                    <Chip
                        style={{backgroundColor: props.color}}
                        sx={{ml: 1.25, pl: 2}}
                        icon={<WarningOutlined/>}
                    />
                )}
                <Collapse in={expanded}>
                    <Box sx={{pt: 2, pb: 1}}>
                        {props.mainValue}
                        {props.children && (<Box sx={{pt: 1}}>
                            {props.children}
                        </Box>)}
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    )
}