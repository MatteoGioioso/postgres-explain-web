import React from "react";
import {Box, Popover} from "@mui/material";
import {useTheme} from "@mui/material/styles";

export const GenericDetailsPopover = (props: { name: string, content: any, children: any, keepCloseCondition?: boolean, style?: any }) => {
    const theme = useTheme();
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
                onClick={handlePopoverOpen}
                style={props.keepCloseCondition ? {} : {
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    textDecorationColor: theme.palette.secondary.light
                }}
            >
                {props.children}
            </span>
            <Popover
                transitionDuration={1000}
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
                onClose={handlePopoverClose}
            >
                <Box sx={{p: 1.2}}>
                    {props.content}
                </Box>
            </Popover>
        </>
    )
}