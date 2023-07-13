import {useMemo} from 'react';

// material-ui
import {useTheme} from '@mui/material/styles';
import {Box, useMediaQuery} from '@mui/material';
import MiniDrawerStyled from './MiniDrawerStyled';
import DrawerHeader from "./DrawerHeader";
import DrawerContent from "./DrawerContent";

// ==============================|| MAIN LAYOUT - DRAWER ||============================== //

const MainDrawer = ({open, handleDrawerToggle, window}) => {
    const theme = useTheme();
    const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box component="nav" sx={{flexShrink: {md: 0}, zIndex: 1300}} aria-label="mailbox folders">
            <MiniDrawerStyled variant="permanent" open={open}>
                <DrawerHeader/>
                <DrawerContent/>
            </MiniDrawerStyled>
        </Box>
    );
};

export default MainDrawer;
