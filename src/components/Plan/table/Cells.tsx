import React from "react";
import {Box, Chip, Collapse, Divider, Grid, Popover, TableCell, Typography} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {
    betterDiskSize,
    betterNumbers,
    betterTiming,
    getEstimationColor, getFunctionFromKind,
    getPercentageColor,
    truncateText
} from "../utils";
import {PlanRow, Property, Stats} from "../types";
import {DollarOutlined, FilterOutlined} from "@ant-design/icons";
import {property} from "lodash";

export const GenericDetailsPopover = (props: { name: string, content: any, children: any, keepCloseCondition?: boolean, style?: any }) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        if (props.keepCloseCondition) return
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <span
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
            >
                {props.children}
            </span>
            <Popover
                id="mouse-over-popover"
                sx={{
                    width: '1200px',
                    ...props.style
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
                slotProps={{paper: {onMouseLeave: handlePopoverClose}}}
            >
                <Box sx={{p: 1.2}}>
                    {props.content}
                </Box>
            </Popover>
        </>
    )
}

export const getRowEstimateDirectionSymbol = (direction: string): string => {
    switch (direction) {
        case 'over':
            return '↑'
        case 'under':
            return '↓'
        default:
            return ''
    }
}

export const TimingCell = ({prop, totalProp, name}: { prop: number, totalProp: number, name?: string }) => {
    const theme = useTheme();
    return (
        <TableCell
            component="th"
            style={{
                backgroundColor: getPercentageColor(prop, totalProp, theme)
            }}>
            {betterTiming(prop)}
        </TableCell>
    )
}

export const headCells = (areBuffersPresent?: boolean) => [
    {
        id: 'exclusive',
        label: 'Time',
        align: 'left',
        disablePadding: false,
        description: "Total node time per worker"
    },
    {
        id: 'inclusive',
        label: 'Cumulative Time',
        align: 'left',
        disablePadding: false,
    },
    {
        id: 'rows',
        label: 'Rows',
        align: 'left',
        disablePadding: false,
        description: <div>Total average rows returned per worker.{` `} <br/>
            <b>NOTE</b>: When the parallel portion of the plan generates only a small number of tuples,
            the leader will often behave very much like an additional worker,
            speeding up query execution. Conversely, when the parallel portion of the plan generates a large number of tuples,
            the leader may be almost entirely occupied with reading the tuples generated by the workers and
            performing any further processing steps that are required by plan nodes above the level of the Gather node <br/>
            <a href="https://www.postgresql.org/docs/current/how-parallel-query-works.html" target="_blank">How parallel query works</a>
        </div>
    },
    {
        id: 'rows_x',
        label: 'Rows E',
        align: 'left',
        disablePadding: false,
        description: "Rows estimation factor"
    },
    {
        id: 'loops',
        label: 'Loops',
        align: 'left',
        disablePadding: false,
        description: "Loops / Workers (it also counts the leader)"
    },
    {
        id: 'reads',
        label: 'Reads',
        align: 'left',
        disablePadding: false,
    },
    {
        id: 'written',
        label: 'Written',
        align: 'left',
        disablePadding: false,
    },
    {
        id: 'node',
        label: 'Node',
        align: 'left',
        disablePadding: false,
    },
    {
        id: 'actions',
        label: '',
        align: 'left',
        disablePadding: false,
    },
]

export interface CellProps {
    row: PlanRow
    expanded: boolean
    stats: Stats
    theme?: any
}

export const RowsCell = ({row, expanded, theme}: CellProps) => {
    return (
        <TableCell align="left" style={{wordWrap: 'break-word', whiteSpace: 'normal', width: '200px'}}>
            {row.scopes.filters && (
                <FilterOutlined style={{color: theme.palette.primary.light, fontSize: '12px'}}/>)} {betterNumbers(row.rows.total)}
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box sx={{pt: 1}}>
                    <Typography><b>Total</b>: {' '}
                        <GenericDetailsPopover name={"Rows"} content={row.rows.total}>
                            {betterNumbers(row.rows.total * (row.workers.launched + 1))}
                        </GenericDetailsPopover>
                    </Typography>
                    <Typography><b>Planned</b>: {' '}
                        <GenericDetailsPopover name={"Planned rows"} content={row.rows.planned_rows}>

                            {betterNumbers(row.rows.planned_rows)}
                        </GenericDetailsPopover>
                    </Typography>
                    {
                        row.scopes.filters && (
                            <>
                                <b>Removed: </b>
                                <GenericDetailsPopover name={"rows removed"} content={row.rows.removed}>
                                    - {' '}{betterNumbers(row.rows.removed)}
                                </GenericDetailsPopover>
                            </>
                        )}

                </Box>
            </Collapse>
        </TableCell>

    )
}

export const BufferReadsCell = ({
                                    expanded, row, stats, theme
                                }: CellProps) => {
    return (
        <TableCell style={{backgroundColor: getPercentageColor(row.buffers.effective_blocks_read, stats.max_blocks_read, theme)}}>
            {betterDiskSize(row.buffers.effective_blocks_read)}
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box sx={{pt: 1}}>

                    {Boolean(row.buffers.exclusive_reads) && (
                        <Typography
                            variant='subtitle2'>Shared: {betterNumbers(row.buffers.exclusive_reads)}
                        </Typography>
                    )}
                    {Boolean(row.buffers.exclusive_temp_reads) && (
                        <Typography
                            variant='subtitle2'>Temp: {betterNumbers(row.buffers.exclusive_temp_reads)}
                        </Typography>
                    )}
                    {Boolean(row.buffers.exclusive_local_reads) && (
                        <Typography
                            variant='subtitle2'>Local: {betterNumbers(row.buffers.exclusive_local_reads)}
                        </Typography>
                    )}

                </Box>
            </Collapse>
        </TableCell>
    )
}

export const BufferWrittenCell = ({
                                      expanded, theme, row, stats
                                  }: CellProps) => {
    return (
        <TableCell style={{backgroundColor: getPercentageColor(row.buffers.effective_blocks_written, stats.max_blocks_written, theme)}}>
            {betterDiskSize(row.buffers.effective_blocks_written)}
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box sx={{pt: 1}}>

                    {Boolean(row.buffers.exclusive_written) && (
                        <Typography
                            variant='subtitle2'>Shared: {betterNumbers(row.buffers.exclusive_written)}
                        </Typography>
                    )}
                    {Boolean(row.buffers.exclusive_temp_written) && (
                        <Typography
                            variant='subtitle2'>Temp: {betterNumbers(row.buffers.exclusive_temp_written)}
                        </Typography>
                    )}
                    {Boolean(row.buffers.exclusive_local_written) && (
                        <Typography
                            variant='subtitle2'>Local: {betterNumbers(row.buffers.exclusive_local_written)}
                        </Typography>
                    )}

                </Box>
            </Collapse>
        </TableCell>
    )
}

export const RowsEstimationCell = ({
                                       row, theme, expanded
                                   }: CellProps) => {
    return (
        <TableCell align="left" style={{backgroundColor: getEstimationColor(row.rows.estimation_factor, theme)}}>
            {getRowEstimateDirectionSymbol(row.rows.estimation_direction) + ' '}
            <GenericDetailsPopover
                content={Math.round(row.rows.estimation_factor * 1000) / 1000}
                name="Rows estimate factor"
            >
                {betterNumbers(row.rows.estimation_factor)}
            </GenericDetailsPopover>
        </TableCell>
    )
}

export const InfoCell = ({row, expanded, stats, theme}: CellProps) => {
    return (
        <TableCell align="left" style={{width: '500px'}}>
            <Grid container>
                {expanded || (
                    <Box sx={{pl: row.level * 2}}>
                        {'└' + '>'}
                    </Box>
                )}
                <div>
                    <Box sx={{pl: expanded ? 0 : 1.5}}>
                        <Typography variant="h5" color='bold'>{row.operation}</Typography>
                    </Box>
                    <NodeStats expanded={expanded} row={row} stats={stats} theme={theme}/>
                </div>
            </Grid>
        </TableCell>
    )
}

function NodeStats({expanded, row, stats, theme}: { expanded: boolean, row: PlanRow, stats: Stats, theme: any }) {
    const scopesNames = Object.keys(row.scopes);
    const areScopesEmpty = Object.values(row.scopes).every(x => x === "")

    return (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
            {!areScopesEmpty && (
                <Box sx={{pt: 1, pb: 1}}>
                    <Divider/>
                </Box>
            )}
            {scopesNames.map(scopeName => (
                row.scopes[scopeName] && (
                    <GenericDetailsPopover
                        style={{width: '1500px'}}
                        keepCloseCondition={row.scopes[scopeName].length <= theme.diagram.text.maxChars}
                        name={scopeName}
                        content={
                            <Typography>
                                <b>{scopeName} </b><code>{row.scopes[scopeName]}</code>
                            </Typography>
                        }
                    >
                        <Typography><b>{scopeName} </b><code>{truncateText(row.scopes[scopeName], theme.diagram.text.maxChars)}</code></Typography>
                    </GenericDetailsPopover>
                )
            ))}

            <Box sx={{pt: 1, pb: 1}}>
                <Divider/>
            </Box>

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

            {row.node_type_specific_properties && (
                <Box sx={{pt: 1, pb: 1}}>
                    <Divider/>
                </Box>
            )}

            {row.node_type_specific_properties.map(property => (
                <div><RenderProperty property={property}/></div>
            ))}

            {row.workers?.list?.length > 0 && (
                <>
                    <Box sx={{pt: 1, pb: 1}}>
                        <Divider/>
                    </Box>
                    {row.workers.list.map(worker => (
                        <div>
                            Worker {worker.number}: time {betterTiming(worker.time)}, rows {betterNumbers(worker.rows)},
                            loops {worker.loops}
                        </div>
                    ))}
                </>
            )}

        </Collapse>
    )
}


export const RenderProperty = ({property}: {
    property: Property,
}) => {
    return (
        property.skip ? (<></>) : (
            <>{property.name}: {getFunctionFromKind(property.kind)((property[property.type]))}</>
        )
    )
}
