import React, {useState} from 'react'
import {PlanRow} from './types'
import {SummaryTableProps} from './interfaces'
// @ts-ignore
import Highlight from 'react-highlight'
import {betterNumbers, getCellWarningColor} from './utils'
import {useTheme} from "@mui/material/styles";
import {Box, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Popover, TableCellProps} from '@mui/material';

const GenericDetailsPopover = (props: { name: string, content: any, children: string }) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            {props.children}
            <Popover
                id="mouse-over-popover"
                sx={{
                    pointerEvents: 'none',
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
            >
                {props.content}
            </Popover>
        </>
    )
}

const getRowEstimateDirectionSymbol = (direction: string): string => {
    switch (direction) {
        case 'over':
            return '↑'
        case 'under':
            return '↓'
        default:
            return ''
    }
}

const ComparatorCell = ({prop, totalProp, name}: { prop: number, totalProp: number, name?: string }) => {
    const theme = useTheme();
    return (
        <TableCell
            component="th"
            style={{
                color: '#2f2f2f',
                backgroundColor: getCellWarningColor(prop, totalProp, theme)
            }}>
            {betterNumbers(prop)}
        </TableCell>
    )
}

const headCells = [
    {
        id: 'exclusive',
        label: 'Time',
        align: 'left',
        disablePadding: false,
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
    },
    {
        id: 'rows-removed',
        label: 'Rows Removed',
        align: 'left',
        disablePadding: false,
    },
    {
        id: 'rows_x',
        label: 'Rows E',
        align: 'left',
        disablePadding: false,
    },
    {
        id: 'loops',
        label: 'Loops',
        align: 'left',
        disablePadding: false,
    },
    {
        id: 'node',
        label: 'Node',
        align: 'left',
        disablePadding: false,
    },
]


function OrderTableHead({order, orderBy}) {
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}


export function SummaryTable({summary, stats}: SummaryTableProps) {
    const [order] = useState('asc');
    const [orderBy] = useState('trackingNo');
    const [selected] = useState([]);

    const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

    return (
        <>
            <TableContainer
                sx={{
                    width: '100vw',
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
                    <OrderTableHead order={order} orderBy={orderBy}/>
                    <TableBody>
                        {summary.map((row, index) => {
                            const labelId = `enhanced-table-checkbox-${index}`;

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
                                    <TableCell align="right">
                                        <div>
                                            {'└' + '──'.repeat(row.node.level) + '->'}
                                            <div>
                                                <div>
                                                    <Box>{row.node.operation} {row.node.scope && `on`} {row.node.scope}</Box>
                                                </div>
                                                <div>
                                                    <div>{row.node.costs}</div>
                                                </div>
                                                <div>
                                                    <div>{row.node.buffers}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
