import * as React from 'react';
import Popover from '@mui/material/Popover';
import {Box} from "@mui/material";

export default function NodePopover(props) {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        if (props.text.length < 40) return
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <div>
            <div
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                {props.component}
            </div>
            <Popover
                id="mouse-over-popover"
                sx={{
                    pointerEvents: 'none',
                    maxWidth: '1500px'
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
                <Box sx={{p: 2}}>
                    {props.children}
                </Box>
            </Popover>
        </div>
    );
}