import React from "react";
import {Box, Popover} from "@mui/material";

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