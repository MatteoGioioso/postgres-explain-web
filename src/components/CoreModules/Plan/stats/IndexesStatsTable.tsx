import MainCard from "../MainCard";
import {Box, Collapse, Divider, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import React, {useContext, useState} from "react";
import {IndexesStats, IndexNode, IndexStats, Stats} from "../types";
import {betterDiskSizeFromBlocks, betterNumbers, betterTiming, capitalizeFirstLetter, getColorFromPercentage, getPercentageColor} from "../utils";
import {ExpandMore} from "../ExpandMore";
import {ApartmentOutlined, DownOutlined} from "@ant-design/icons";
import {useFocus} from "../hooks";
import {TableTabsContext} from "../Contexts";
import {useTheme} from "@mui/material/styles";
import {GenericDetailsPopover} from "../../GenericDetailsPopover";

export interface IndexesStatsTableProps {
    stats: IndexesStats
}

export const IndexesStatsTable = ({stats}: IndexesStatsTableProps) => {
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
                            {headCells().map((headCell) => (
                                <TableCell
                                    key={headCell.id}
                                    sx={{fontSize: '18px'}}
                                >
                                    {headCell.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stats.indexes.map((index) => {
                            return <Row data={index} theme={theme}/>
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </MainCard>
    )
}

const Row = ({data, theme}: { data: IndexStats, theme: any }) => {
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
                {data.name}
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    {data.indexes.map(node => (
                        <NodeSubRow node={node}/>
                    ))}
                </Collapse>
            </TableCell>
            <TableCell>
                <b>{betterTiming(data.total_time)}</b>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    {data.indexes.map(i => (
                        <Box sx={{pb: 1, pt: 1.5}}>{i.exclusive_time}</Box>
                    ))}
                </Collapse>
            </TableCell>
            <TableCell style={{backgroundColor: getColorFromPercentage(data.percentage, theme)}}>
                {betterNumbers(data.percentage)} %
                {data.indexes.map(i => (
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <Box sx={{pb: 1, pt: 1.5}}>0</Box>
                    </Collapse>
                ))}
            </TableCell>
        </TableRow>
    )
}

const NodeSubRow = ({node}: { node: IndexNode }) => {
    const {switchToNode} = useFocus(node.id);
    const {setTabIndex} = useContext(TableTabsContext);

    return (
        <Box sx={{pb: 1, pt: 1.5}}>
            <IconButton onClick={() => {
                setTabIndex(0)
                setTimeout(()=> {
                    switchToNode(node.id)
                })
            }}>
                <ApartmentOutlined style={{fontSize: '10px'}}/>
            </IconButton>
            {node.type}
        </Box>
    )
}

const headCells = (areBuffersPresent?: boolean) => [
    {
        id: 'name',
        label: 'General Stats',
        align: 'left',
        description: ""
    },
    {
        id: 'formatted',
        label: '',
        align: 'left',
        description: ""
    },
    {
        id: 'full',
        label: '',
        align: 'left',
        description: ""
    },
]