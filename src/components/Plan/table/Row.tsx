import {PlanRow} from "../types";
import {Box, Grid, TableCell, TableRow, Typography} from "@mui/material";
import {betterNumbers} from "../utils";
import React from "react";
import {ComparatorCell, GenericDetailsPopover, getRowEstimateDirectionSymbol} from "./Cells";
import Highlight from 'react-highlight'

export function Row(row: PlanRow) {
    return (
        <TableRow
            hover
            role="checkbox"
            sx={{'&:last-child td, &:last-child th': {border: 0}}}
            tabIndex={-1}
            key={row.node_id}
        >
            <ComparatorCell prop={row.exclusive} totalProp={row.execution_time} name={'Exclusive time'}/>
            <ComparatorCell prop={row.inclusive} totalProp={row.execution_time} name={'Inclusive time'}/>
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
                        {'└' + '──'.repeat(row.node.level) + '->'}
                    </Grid>
                    <Grid>
                        <div>
                            <div>
                                <Box sx={{pl: 1.5}}>
                                    <Typography variant="h5" color='bold'>{row.node.operation}</Typography>
                                    {row.node.scope && `on`} {row.node.scope}
                                </Box>
                            </div>
                            <div>
                                <div>{row.node.costs}</div>
                            </div>
                            <div>
                                <div>{row.node.buffers}</div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </TableCell>
        </TableRow>
    );
}
