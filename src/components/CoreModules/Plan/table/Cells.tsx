import React from "react";
import {Box, Chip, Collapse, Divider, Grid, TableCell, Tooltip, Typography} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {
    betterDiskSizeFromBlocks,
    betterNumbers,
    betterTiming,
    getEstimationColor,
    getFunctionFromKind, getPercentage,
    getPercentageColor,
    truncateText
} from "../../utils";
import {PlanRow, Property, Stats} from "../types";
import {DollarOutlined, FilterOutlined} from "@ant-design/icons";
import {GenericDetailsPopover} from "../../GenericDetailsPopover";

export const headCells = (): {
    id: string,
    label: string,
    align?: string,
    disablePadding?: boolean,
    description?: string | React.JSX.Element
}[] => [
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
        description: <div>Total rows returned per node.{` `} <br/>
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
        id: 'hits',
        label: 'Cache',
        align: 'left'
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
    hovered?: boolean
}

export const TimingCell = ({prop, totalProp, name, hovered}: { prop: number, totalProp: number, name?: string, hovered: boolean }) => {
    const theme = useTheme();

    return (
        <TableCell
            style={{
                backgroundColor: getPercentageColor(prop, totalProp, theme, hovered)
            }}
        >
            <GenericDetailsPopover name={name} content={prop} keepCloseCondition={prop === 0}>
                {betterTiming(prop)}
            </GenericDetailsPopover>
        </TableCell>
    )
}

export const RowsCell = ({row, expanded, theme, hovered}: CellProps) => {
    return (
        <TableCell
            align="left"
            style={{
                wordWrap: 'break-word',
                whiteSpace: 'normal',
                width: '200px',
                backgroundColor: getPercentageColor(row.rows.removed, row.rows.total, theme, hovered)
            }}
        >
            {row.scopes.filters && (
                <Tooltip title="Rows have been filtered">
                    <FilterOutlined style={{marginRight: 4, color: theme.palette.secondary.dark, fontSize: '12px'}}/>
                </Tooltip>
            )}
            {betterNumbers(row.rows.total)}
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <RowsCellCollapsedContent row={row} expanded={expanded} stats={null}/>
            </Collapse>
        </TableCell>

    )
}

export const RowsCellCollapsedContent = ({row}: CellProps) => {
    const getAvgText = (data: PlanRow): string => {
        return data.workers.launched > 0 ? "Worker" : "Loop";
    }

    return (
        <Box sx={{pt: 1}}>
            <Typography><b>Avg per {getAvgText(row)}</b>: {' '}
                <GenericDetailsPopover name={"Rows"} content={row.rows.total_avg}>
                    {betterNumbers(row.rows.total_avg)}
                </GenericDetailsPopover>
            </Typography>
            <Typography><b>Planned</b>: {' '}
                <GenericDetailsPopover name={"Planned rows"} content={row.rows.planned_rows}>
                    {betterNumbers(row.rows.planned_rows)}
                </GenericDetailsPopover>
            </Typography>
            {
                Boolean(row.rows.removed) && (
                    <>
                        <b>Removed: </b>
                        <GenericDetailsPopover name={"rows removed"} content={row.rows.removed}>
                            - {' '}{betterNumbers(row.rows.removed)}
                        </GenericDetailsPopover>
                    </>
                )}

        </Box>
    )
}

export const LoopsCell = ({row, expanded}: CellProps) => {
    return (
        <TableCell align="right">
            {betterNumbers(row.loops)} / {row.workers.launched + 1}
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                {Boolean(row.workers.planned) && (
                    <Typography
                        variant='subtitle2'>Workers Planned: {row.workers.planned}
                    </Typography>
                )}
                {Boolean(row.workers.launched) && (
                    <Typography
                        variant='subtitle2'>Workers Launched: {row.workers.launched}
                    </Typography>
                )}
            </Collapse>
        </TableCell>
    )
}

export const BufferReadsCell = ({
                                    expanded, row, stats, theme, hovered
                                }: CellProps) => {
    return (
        <TableCell style={{backgroundColor: getPercentageColor(row.buffers.effective_blocks_read, stats.max_blocks_read, theme, hovered)}}>
            {betterDiskSizeFromBlocks(row.buffers.effective_blocks_read)}
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <BufferReadsCellCollapsedContent row={row} expanded={expanded} stats={stats}/>
            </Collapse>
        </TableCell>
    )
}

export const BufferReadsCellCollapsedContent = ({row}: CellProps) => {
    return (
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
    )
}

export const BufferWrittenCell = ({
                                      expanded, theme, row, stats, hovered
                                  }: CellProps) => {
    return (
        <TableCell
            style={{backgroundColor: getPercentageColor(row.buffers.effective_blocks_written, stats.max_blocks_written, theme, hovered)}}>
            {betterDiskSizeFromBlocks(row.buffers.effective_blocks_written)}
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <BufferWrittenCellCollapsedContent row={row} expanded={expanded} stats={stats}/>
            </Collapse>
        </TableCell>
    )
}

export const BufferWrittenCellCollapsedContent = ({row}: CellProps) => {
    return (
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
    )
}

export const BufferHitsCell = ({
                                   expanded, theme, row, stats
                               }: CellProps) => {
    return (
        <TableCell>
            {betterDiskSizeFromBlocks(row.buffers.effective_blocks_hits)}
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <BufferHitsCellCollapsedContent row={row} expanded={expanded} stats={stats}/>
            </Collapse>
        </TableCell>
    )
}

export const BufferHitsCellCollapsedContent = ({row}: CellProps) => {
    return (
        <Box sx={{pt: 1}}>
            {Boolean(row.buffers.exclusive_hits) && (
                <Typography
                    variant='subtitle2'>Shared: {betterNumbers(row.buffers.exclusive_hits)}
                </Typography>
            )}
            {Boolean(row.buffers.exclusive_local_hits) && (
                <Typography
                    variant='subtitle2'>Local: {betterNumbers(row.buffers.exclusive_local_hits)}
                </Typography>
            )}
        </Box>
    )
}


export const RowsEstimationCell = ({row, theme, expanded, hovered}: CellProps) => {
    return (
        <TableCell align="left" style={{backgroundColor: getEstimationColor(row.rows.estimation_factor, theme, hovered)}}>
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
        <TableCell align="left">
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

export function NodeStats({expanded, row, stats, theme}: { expanded: boolean, row: PlanRow, stats: Stats, theme: any }) {
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
                        key={scopeName}
                        style={{width: '1500px'}}
                        keepCloseCondition={row.scopes[scopeName].length <= theme.diagram.text.maxChars}
                        name={scopeName}
                        content={
                            <Typography>
                                <b>{scopeName} </b><code>{row.scopes[scopeName]}</code>
                            </Typography>
                        }
                    >
                        <Typography><b>{scopeName} </b><code>{truncateText(row.scopes[scopeName], 25)}</code></Typography>
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
                    label={betterNumbers(row.costs.total_cost)}
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

            {Object.keys(row.node_type_specific_properties).length > 0 && (
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
                    {row.workers.list.map((worker, index) => (
                        <GenericDetailsPopover
                            name={`worker-${index}`}
                            content={worker.slice(1).map(property => renderStringProperty(property)).join(", ")}
                        >
                            <div>{renderStringProperty(worker[0])}</div>
                        </GenericDetailsPopover>
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

export const renderStringProperty = (property: Property): string => {
    return property.skip ? '' : `${property.name}: ${getFunctionFromKind(property.kind)((property[property.type]))}`
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

export function isColumnShowing(columnName: string, hidedColumns: { [key: string]: boolean }): boolean {
    return !hidedColumns[columnName]
}