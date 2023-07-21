import {PlanRow, Stats} from "../types";
import {Box, Chip, Collapse, Divider, Grid, IconButton, TableCell, TableRow, Typography} from "@mui/material";
import {betterDiskSize, betterNumbers, betterTiming, getEstimationColor, getPercentageColor, truncateText} from "../utils";
import React, {useEffect, useState} from "react";
import {
    TimingCell,
    GenericDetailsPopover,
    getRowEstimateDirectionSymbol,
    RowsCell,
    BufferReadsCell,
    BufferWrittenCell,
    RowsEstimationCell
} from "./Cells";
import {useTheme} from "@mui/material/styles";
import {ApartmentOutlined, CloseOutlined, DollarOutlined, DownOutlined, ZoomInOutlined} from "@ant-design/icons";
import {ExpandMore} from "../ExpandMore";
import {useFocus, useNodeHover} from "../hooks";

export interface RowProps {
    row: PlanRow
    stats: Stats
}

function NodeStats({expanded, row, stats, theme}: { expanded: boolean, row: PlanRow, stats: Stats, theme: any }) {
    return (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{pt: 1, pb: 1}}>
                <Divider/>
            </Box>
            {Object.keys(row.scopes).map(scopeName => (
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
        </Collapse>
    )
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
                    <Typography
                        variant='subtitle2'>Workers Planned: {row.workers.planned}
                    </Typography>
                    <Typography
                        variant='subtitle2'>Workers Launched: {row.workers.launched}
                    </Typography>
                </Collapse>
            </TableCell>

            <BufferReadsCell row={row} expanded={expanded} stats={stats} theme={theme}/>

            <BufferWrittenCell row={row} expanded={expanded} stats={stats} theme={theme}/>

            <TableCell align="left">
                <Grid container>
                    <Box sx={{pl: row.level * 4}}>
                        <Grid>
                            {'└' + '─>'}
                        </Grid>
                    </Box>
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