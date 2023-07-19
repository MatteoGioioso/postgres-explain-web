import {PlanRow, Stats} from "../types";
import {Backdrop, Box, Chip, Collapse, Grid, IconButton, TableCell, TableRow, Typography} from "@mui/material";
import {betterDiskSize, betterNumbers, getPercentageColor} from "../utils";
import React, {useEffect, useState} from "react";
import {TimingCell, GenericDetailsPopover, getRowEstimateDirectionSymbol} from "./Cells";
import {useTheme} from "@mui/material/styles";
import {ApartmentOutlined, CloseOutlined, DollarOutlined, DownOutlined, RollbackOutlined, ZoomInOutlined} from "@ant-design/icons";
import {ExpandMore} from "../ExpandMore";
import {useFocus} from "../hooks";
import {Simulate} from "react-dom/test-utils";

export interface RowProps {
    row: PlanRow
    stats: Stats
}

function NodeStats({expanded, row, stats, theme}: { expanded: boolean, row: PlanRow, stats: Stats, theme: any }) {
    return <Collapse in={expanded} timeout="auto" unmountOnExit>
        <div>
            Total cost:
            <Chip
                style={{backgroundColor: getPercentageColor(row.costs.total_cost, stats.max_cost, theme)}}
                icon={<DollarOutlined style={{fontSize: '0.75rem', color: 'inherit'}}/>}
                label={`${row.costs.total_cost}`}
                sx={{ml: 1.25, pl: 1}}
                size="small"
            />
        </div>
        <div>
            Startup cost: {row.costs.startup_cost}
        </div>
        <div>
            Plan width: {row.costs.plan_width}
        </div>
    </Collapse>
}


export function Row({row, stats}: RowProps) {
    const theme = useTheme();
    const {isFocused, switchToNode, isUnfocused, closeFocusNavigation, focus} = useFocus(row.node_id);
    const [expanded, setExpanded] = useState(isFocused);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    useEffect(() => {
        setExpanded(isFocused)
    }, [isFocused])

    const handleRowClick = (nodeId: string) => {
    }

    const getRowStyle = (): {} => {
        if (isUnfocused()) {
            return {pointerEvents: 'none'}
        } else if (isFocused) {
            return {boxShadow: theme.shadows[23], border: `2px solid ${theme.palette.secondary.main}`}
        }

        return {}
    }

    return (
        <TableRow
            hover
            role="checkbox"
            sx={{'&:last-child td, &:last-child th': {border: 0}}}
            tabIndex={-1}
            key={row.node_id}
            id={row.node_id}
            style={getRowStyle()}
            onClick={() => handleRowClick(row.node_id)}
        >

            <TimingCell prop={row.exclusive} totalProp={row.execution_time} name={'Exclusive time'}/>
            <TimingCell prop={row.inclusive} totalProp={row.execution_time} name={'Inclusive time'}/>
            <TableCell align="right">
                <GenericDetailsPopover content={row.rows.total}
                                       name="Rows">{betterNumbers(row.rows.total)}</GenericDetailsPopover>
            </TableCell>
            <TableCell align="right">
                {
                    row.rows.filters && (
                        <>- {' '}{betterNumbers(row.rows.removed)}
                            <Collapse in={expanded} timeout="auto" unmountOnExit>
                                <Typography variant='subtitle2'>Filter: <code>{row.rows.filters}</code></Typography>
                            </Collapse>
                        </>
                    )
                }

            </TableCell>
            <TableCell align="right">
                <>
                    {getRowEstimateDirectionSymbol(row.rows.estimation_direction) + ' '}
                    <GenericDetailsPopover content={row.rows.estimation_factor}
                                           name="Rows estimate factor">{betterNumbers(row.rows.estimation_factor)}</GenericDetailsPopover>
                </>

            </TableCell>
            <TableCell align="right">
                <GenericDetailsPopover name={'Loops'}
                                       content={row.loops}>{betterNumbers(row.loops)}</GenericDetailsPopover>
            </TableCell>
            <TableCell style={{backgroundColor: getPercentageColor(row.buffers.effective_blocks_read, stats.max_blocks_read, theme)}}>
                {betterDiskSize(row.buffers.effective_blocks_read)}
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Typography
                        variant='subtitle2'>Shared: {betterNumbers(row.buffers.exclusive_reads)}
                    </Typography>
                    <Typography
                        variant='subtitle2'>Temp: {betterNumbers(row.buffers.exclusive_temp_reads)}
                    </Typography>
                </Collapse>
            </TableCell>
            <TableCell style={{backgroundColor: getPercentageColor(row.buffers.effective_blocks_written, stats.max_blocks_written, theme)}}>
                {betterDiskSize(row.buffers.effective_blocks_written)}
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Typography
                        variant='subtitle2'>Shared: {betterNumbers(row.buffers.exclusive_written)}
                    </Typography>
                    <Typography
                        variant='subtitle2'>Temp: {betterNumbers(row.buffers.exclusive_temp_written)}
                    </Typography>
                </Collapse>
            </TableCell>


            <TableCell align="left">
                <Grid container>
                    <Grid>
                        {'└' + '──'.repeat(row.level) + '->'}
                    </Grid>
                    <Grid>
                        <div>
                            <div>
                                <Box sx={{pl: 1.5}}>
                                    <Typography variant="h5" color='bold'>{row.operation}</Typography>
                                </Box>
                            </div>
                            <NodeStats expanded={expanded} row={row} stats={stats} theme={theme}/>

                        </div>
                    </Grid>
                </Grid>
            </TableCell>

            <TableCell>
                {!isUnfocused() && (
                    <>
                        <ExpandMore expand={expanded} onClick={handleExpandClick}>
                            <DownOutlined style={{fontSize: '10px'}}/>
                        </ExpandMore>

                        <IconButton onClick={() => focus(false)}>
                            <ZoomInOutlined style={{color: 'inherit', fontSize: '10px'}}/>
                        </IconButton>
                    </>
                )}

                {isFocused && (
                    <>
                        <IconButton onClick={switchToNode}>
                            <ApartmentOutlined style={{fontSize: '10px'}}/>
                        </IconButton>
                        <IconButton onClick={(e) => closeFocusNavigation(e, false)}>
                            <CloseOutlined style={{fontSize: '10px', color: 'inherit'}}/>
                        </IconButton>
                    </>
                )}
            </TableCell>
        </TableRow>
    );
}