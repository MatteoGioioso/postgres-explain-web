import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 1}}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export default function NodeTabs() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <Tabs value={value} onChange={handleChange} sx={{p: 0}} aria-label="basic tabs example">
                <Tab sx={{p: 0}} label={<Typography>General</Typography>}/>
                <Tab sx={{p: 0}} label="Item Two"/>
                <Tab sx={{p: 0}} label="Item Three"/>
            </Tabs>
            <CustomTabPanel value={value} index={0}>
                <Typography>Item One</Typography>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                Item Two
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                Item Three
            </CustomTabPanel>
        </>
    );
}