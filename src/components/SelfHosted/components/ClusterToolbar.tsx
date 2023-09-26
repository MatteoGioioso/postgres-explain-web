import {AppBar, Box, Button, Divider, IconButton, Menu, Stack, Toolbar, Typography} from "@mui/material";
import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import {AUTO_REFRESH_INTERVALS} from "../../CoreModules/autoRefresher";
import {formatTiming} from "../../CoreModules/utils";
import {ClockCircleOutlined, SyncOutlined} from "@ant-design/icons";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {Interval, INTERVALS} from "../../CoreModules/timeIntervals";
import {ButtonAction} from "../../CoreModules/Buttons";

export interface ClusterToolbarProps {
    onSelectTimeInterval: (interval: Interval) => void
    onSelectAutoRefreshInterval: (interval: number) => void
    autoRefreshInterval: number
    timeInterval: Interval
}

export const ClusterToolbar = ({
                                   onSelectAutoRefreshInterval,
                                   autoRefreshInterval,
                                   onSelectTimeInterval,
                                   timeInterval
                               }: ClusterToolbarProps) => {
    return (
        <>
            <AppBar position="static" color='inherit' elevation={0}
                    sx={{
                        border: '1px solid',
                        borderRadius: 2,
                        borderColor: theme => theme.palette.grey['A800'],
                    }}
            >
                <Toolbar variant="dense">
                    <Box sx={{flex: '1 1 100%'}}></Box>
                    <TimeIntervalPicker
                        onSelectTimeInterval={onSelectTimeInterval}
                        timeInterval={timeInterval}
                    />
                    <Box sx={{pl: 4}}/>
                    <AutoRefreshIntervalsDropdown
                        autoRefreshInterval={autoRefreshInterval}
                        onSelectAutoRefreshInterval={onSelectAutoRefreshInterval}
                    />
                </Toolbar>
            </AppBar>
        </>
    )
}

export interface AutoRefreshIntervalsDropdownProps {
    onSelectAutoRefreshInterval: (interval: number) => void
    autoRefreshInterval: number
}

export const AutoRefreshIntervalsDropdown = ({onSelectAutoRefreshInterval, autoRefreshInterval}: AutoRefreshIntervalsDropdownProps) => {
    const handleChange = (event: SelectChangeEvent) => {
        onSelectAutoRefreshInterval(Number(event.target.value))
    };

    return (
        <>
            <SyncOutlined/>
            <FormControl sx={{minWidth: 90}} size="small">
                <Select
                    sx={{
                        boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': {border: 0}
                    }}
                    id="autorefresh-dropdown"
                    value={autoRefreshInterval.toString()}
                    label={<SyncOutlined/>}
                    onChange={handleChange}
                >
                    <MenuItem value={0}>
                        <em>Off</em>
                    </MenuItem>
                    {AUTO_REFRESH_INTERVALS.map(interval => (
                        <MenuItem value={interval}>{formatTiming(interval)}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    );
}

export interface TimeIntervalPickerProps {
    onSelectTimeInterval: (interval: Interval) => void
    timeInterval: Interval
}

export const TimeIntervalPicker = ({timeInterval, onSelectTimeInterval}: TimeIntervalPickerProps) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickTimeInterval = (interval: Interval) => {
        onSelectTimeInterval(interval)
        setAnchorEl(null);
    }

    return (
        <>
            <ButtonAction
                reverseIconPosition
                onClick={handleClick}
                icon={<ClockCircleOutlined/>}
                title={timeInterval.name}
                sx={{
                    color: theme => theme.palette.secondary['600'],
                    pl: 2, pr: 2
                }}
                size='small'
            />
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <Box
                    sx={{
                        p: 2
                    }}
                >
                    <Stack direction='row' spacing={2} divider={<Divider orientation="vertical" flexItem/>}>
                        <Box>
                            <Typography>From:</Typography>
                            <BasicDateTimePicker/>
                            <Box sx={{pt: 2}}/>
                            <Typography>To:</Typography>
                            <BasicDateTimePicker/>
                        </Box>

                        <Box>
                            {INTERVALS.map(interval => (
                                <MenuItem onClick={() => handleClickTimeInterval(interval)}>{interval.name}</MenuItem>
                            ))}
                        </Box>
                    </Stack>
                </Box>

            </Menu>
        </>
    )
}

export const BasicDateTimePicker = () => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker slotProps={{textField: {size: 'small'}}}/>
        </LocalizationProvider>
    );
}

