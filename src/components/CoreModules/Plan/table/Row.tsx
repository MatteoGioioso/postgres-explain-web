import {PlanRow, Stats} from "../types";
import {Box, Collapse, Grid, IconButton, TableCell, TableRow, Typography} from "@mui/material";
import {betterNumbers, betterTiming, getPercentageColor} from "../utils";
import React, {memo, useContext, useEffect, useState} from "react";
import {BufferReadsCell, BufferWrittenCell, InfoCell, RowsCell, RowsEstimationCell, TimingCell} from "./Cells";
import {useTheme} from "@mui/material/styles";
import {ApartmentOutlined, CloseOutlined, DownOutlined} from "@ant-design/icons";
import {ExpandMore} from "../ExpandMore";
import {useFocus, useNodeHover} from "../hooks";
import {TableTabsContext} from "../Contexts";

export interface RowProps {
    row: PlanRow
    stats: Stats
}


export const Row = memo(({row, stats}: RowProps) => {
    const theme = useTheme();
    const {isFocused, switchToNode, isUnfocused, closeFocusNavigation, focus} = useFocus(row.node_id);
    const [expanded, setExpanded] = useState(isFocused);
    const {setTabIndex} = useContext(TableTabsContext);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const getRowStyle = (): {} => {
        if (isFocused) {
            return {border: `2px solid ${theme.palette.secondary.main}`}
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
        >
            <TableCell
                component="th"
                style={{
                    backgroundColor: getPercentageColor(row.exclusive, row.execution_time, theme)
                }}>
                {betterTiming(row.exclusive)}
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Box sx={{pt: 1}}>
                        <Typography variant='subtitle2'>
                            Total: {betterTiming(row.exclusive * (row.workers.launched + 1))}
                        </Typography>
                    </Box>
                </Collapse>
            </TableCell>

            <TimingCell prop={row.inclusive} totalProp={row.execution_time} name={'Inclusive time'}/>

            <RowsCell row={row} expanded={expanded} stats={stats} theme={theme}/>

            <RowsEstimationCell row={row} expanded={expanded} stats={stats}/>

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

            <BufferReadsCell row={row} expanded={expanded} stats={stats} theme={theme}/>

            <BufferWrittenCell row={row} expanded={expanded} stats={stats} theme={theme}/>

            <InfoCell row={row} expanded={expanded} stats={stats} theme={theme}/>

            <TableCell>
                <ExpandMore expand={expanded} onClick={handleExpandClick}>
                    <DownOutlined style={{fontSize: '10px'}}/>
                </ExpandMore>
                <IconButton onClick={() => {
                    setTabIndex(0)
                    // Probably a quirk or a bug with React flow, somehow setTimeout will help to focus on the now
                    setTimeout(()=> {
                        switchToNode(row.node_id)
                    })
                }}>
                    <ApartmentOutlined style={{fontSize: '10px'}}/>
                </IconButton>
                {isFocused && (
                    <>
                        <IconButton onClick={closeFocusNavigation}>
                            <CloseOutlined style={{fontSize: '10px', color: 'inherit'}}/>
                        </IconButton>
                    </>
                )}
            </TableCell>
        </TableRow>
    );
})