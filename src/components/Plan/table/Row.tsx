import {PlanRow, Stats} from "../types";
import {Box, Collapse, Grid, IconButton, TableCell, TableRow, Typography} from "@mui/material";
import {betterNumbers, betterTiming, getPercentageColor} from "../utils";
import React, {useEffect, useState} from "react";
import {BufferReadsCell, BufferWrittenCell, InfoCell, RowsCell, RowsEstimationCell, TimingCell} from "./Cells";
import {useTheme} from "@mui/material/styles";
import {ApartmentOutlined, CloseOutlined, DownOutlined} from "@ant-design/icons";
import {ExpandMore} from "../ExpandMore";
import {useFocus, useNodeHover} from "../hooks";

export interface RowProps {
    row: PlanRow
    stats: Stats
}


export function Row({row, stats}: RowProps) {
    const theme = useTheme();
    const {isFocused, switchToNode, isUnfocused, closeFocusNavigation, focus} = useFocus(row.node_id);
    const {setHover, unsetHover, isHovered} = useNodeHover(row.node_id);
    const [expanded, setExpanded] = useState(isFocused);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    useEffect(() => {
        setExpanded(isFocused)
    }, [isFocused])

    const getRowStyle = (): {} => {
        if (isHovered(row.node_id)) {
            return {boxShadow: theme.shadows[23], border: `2px solid ${theme.palette.secondary.main}`}
        }

        if (isUnfocused()) {
            return {pointerEvents: 'none'}
        } else if (isFocused) {
            return {boxShadow: theme.shadows[23], border: `2px solid ${theme.palette.secondary.main}`}
        }

        return {}
    }

    return (
        <TableRow
            onMouseEnter={setHover}
            onMouseLeave={unsetHover}
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
                            Total: {betterTiming(row.exclusive * (row.workers.launched + 1))} for {row.workers.launched + 1} workers
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
                {!isUnfocused() && (
                    <>
                        <ExpandMore expand={expanded} onClick={handleExpandClick}>
                            <DownOutlined style={{fontSize: '10px'}}/>
                        </ExpandMore>
                    </>
                )}

                {isFocused && (
                    <>
                        <IconButton onClick={switchToNode}>
                            <ApartmentOutlined style={{fontSize: '10px'}}/>
                        </IconButton>
                        <IconButton onClick={closeFocusNavigation}>
                            <CloseOutlined style={{fontSize: '10px', color: 'inherit'}}/>
                        </IconButton>
                    </>
                )}

                {!isFocused && !isUnfocused() && (
                    // <IconButton onClick={focus}>
                    //     <ZoomInOutlined style={{color: 'inherit', fontSize: '10px'}}/>
                    // </IconButton>
                    <IconButton onClick={switchToNode}>
                        <ApartmentOutlined style={{fontSize: '10px'}}/>
                    </IconButton>
                )}
            </TableCell>
        </TableRow>
    );
}