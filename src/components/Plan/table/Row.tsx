import {PlanRow, Stats} from "../types";
import {Box, Chip, Collapse, Grid, IconButton, styled, TableCell, TableRow, Typography} from "@mui/material";
import {betterNumbers, betterTiming, getPercentageColor} from "../utils";
import React, {useEffect, useState} from "react";
import {TimingCell, GenericDetailsPopover, getRowEstimateDirectionSymbol} from "./Cells";
import Highlight from 'react-highlight'
import {useTheme} from "@mui/material/styles";
import {useLocation} from "react-router-dom";
import {DollarOutlined, DownOutlined, FieldTimeOutlined, RollbackOutlined} from "@ant-design/icons";
import {ExpandMore} from "../ExpandMore";

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
    const location = useLocation();
    const hashValue = (location.hash || "").replace("#", "")
    const isFocused = (): boolean => {
        return hashValue === row.node_id
    }
    const [expanded, setExpanded] = useState(isFocused());
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    const handleClickBackFocus = () => {
        window.location.hash = "";
        window.scrollTo(0, 0);
    }

    useEffect(() => {
        setExpanded(isFocused())
    }, [location.hash])

    return (
        <TableRow
            hover
            role="checkbox"
            sx={{'&:last-child td, &:last-child th': {border: 0}}}
            tabIndex={-1}
            key={row.node_id}
            id={row.node_id}
            style={isFocused() ? {boxShadow: theme.shadows[23], border: `2px solid ${theme.palette.secondary.main}`} : {}}
        >

            <TimingCell prop={row.exclusive} totalProp={row.execution_time} name={'Exclusive time'}/>
            <TimingCell prop={row.inclusive} totalProp={row.execution_time} name={'Inclusive time'}/>
            <TableCell align="right">
                <GenericDetailsPopover content={row.rows.total}
                                       name="Rows">{betterNumbers(row.rows.total)}</GenericDetailsPopover>
            </TableCell>
            <TableCell align="left">
                <>
                    {
                        row.rows.filters && (
                            <>
                                - {' '}
                                <GenericDetailsPopover
                                    content={
                                        <div>
                                            <p>Filters: <Highlight>{row.rows.filters}</Highlight></p>
                                            <p>Removed: {row.rows.removed}</p>
                                        </div>
                                    }
                                    name="Rows removed by a filter"
                                >
                                    {betterNumbers(row.rows.removed)}
                                </GenericDetailsPopover>
                            </>
                        )
                    }
                </>

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
                <ExpandMore expand={expanded} onClick={handleExpandClick}>
                    <DownOutlined style={{fontSize: '10px'}}/>
                </ExpandMore>
                {isFocused() && (
                    <IconButton onClick={handleClickBackFocus}>
                        <RollbackOutlined style={{fontSize: '10px'}}/>
                    </IconButton>
                )}
            </TableCell>

        </TableRow>
    );
}