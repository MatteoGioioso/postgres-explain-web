import MainCard from "../MainCard";
import {Box, Collapse, Divider, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import React, {useContext, useState} from "react";
import {IndexesStats, IndexNode, IndexStats, NodeNode, NodesStats, NodeStats, Stats, TableNode, TablesStats, TableStats} from "../types";
import {
    betterDiskSizeFromBlocks,
    betterNumbers,
    betterTiming,
    capitalizeFirstLetter,
    getColorFromPercentage,
    getPercentageColor
} from "../../utils";
import {ExpandMore} from "../ExpandMore";
import {ApartmentOutlined, DownOutlined} from "@ant-design/icons";
import {useFocus} from "../hooks";
import {TableTabsContext} from "../Contexts";
import {useTheme} from "@mui/material/styles";
import {GenericDetailsPopover} from "../../GenericDetailsPopover";

export interface GenericStatsTableProps {
    stats: IndexesStats | TablesStats | NodesStats
    headCells: any[]
}

export const GenericStatsTable = ({stats, headCells}: GenericStatsTableProps) => {
    const theme = useTheme();
    return (
        <MainCard content={false} sx={{width: '40vw'}}>
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
                    title={"General stats"}
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
                            {headCells.map((headCell) => (
                                <TableCell
                                    key={headCell.id}
                                >
                                    {headCell.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stats?.stats.map((index) => {
                            return <Row data={index} theme={theme}/>
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </MainCard>
    )
}

const Row = ({data, theme}: { data: IndexStats | TableStats | NodeStats, theme: any }) => {
    const [expanded, setExpanded] = useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <TableRow
            hover
            role="checkbox"
            sx={{'&:last-child td, &:last-child th': {border: 0}}}
            tabIndex={-1}
            key={data.name}
            id={data.name}
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
                {data.name} ({data.nodes.length})
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    {data.nodes.map(node => (
                        <NodeSubRow node={node}/>
                    ))}
                </Collapse>
            </TableCell>
            <TableCell>
                <b>{betterTiming(data.total_time)}</b>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    {data.nodes.map(i => (
                        <Box sx={{pb: 1, pt: 1.5}}>{i.exclusive_time}</Box>
                    ))}
                </Collapse>
            </TableCell>
            <TableCell style={{backgroundColor: getColorFromPercentage(data.percentage, theme)}}>
                {betterNumbers(data.percentage)} %
                {data.nodes.map(i => (
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <Box sx={{pb: 1, pt: 1.5}}>0</Box>
                    </Collapse>
                ))}
            </TableCell>
        </TableRow>
    )
}

const NodeSubRow = ({node}: { node: IndexNode | TableNode | NodeNode }) => {
    const {switchToNode} = useFocus(node.id);
    const {setTabIndex} = useContext(TableTabsContext);

    return (
        <Box sx={{pb: 1, pt: 1.5}}>
            <IconButton onClick={() => {
                setTabIndex(0)
                setTimeout(() => {
                    switchToNode(node.id)
                })
            }}>
                <ApartmentOutlined style={{fontSize: '10px'}}/>
            </IconButton>
            {node.type}
        </Box>
    )
}

export const indexesHeadCells = [
    {
        id: 'name',
        label: 'Index',
        align: 'left',
        description: ""
    },
    {
        id: 'formatted',
        label: 'Time',
        align: 'left',
        description: ""
    },
    {
        id: 'full',
        label: '%',
        align: 'left',
        description: ""
    },
]

export const tablesHeadCells = [
    {
        id: 'name',
        label: 'Table',
        align: 'left',
        description: ""
    },
    {
        id: 'time',
        label: 'Time',
        align: 'left',
        description: ""
    },
    {
        id: 'full',
        label: '%',
        align: 'left',
        description: ""
    },
]

export const nodesHeadCells = [
    {
        id: 'name',
        label: 'Node',
        align: 'left',
        description: ""
    },
    {
        id: 'time',
        label: 'Time',
        align: 'left',
        description: ""
    },
    {
        id: 'full',
        label: '%',
        align: 'left',
        description: ""
    },
]