import {Grid, Tab, Typography, Tabs, Box} from "@mui/material";
import React, {useState} from "react";

export function CustomTabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    );
}

export interface TabsProps {
    tabs: JSX.Element[]

}

export const TableTabs = (props) => {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{width: '100%'}}>
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="table tabs">
                <Tab
                    label={
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Typography variant="h5">Table</Typography>
                            </Grid>
                        </Grid>
                    }/>
                <Tab label={
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Typography variant="h5">Stats</Typography>
                        </Grid>
                    </Grid>
                }/>
                <Tab label={
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Typography variant="h5">Indexes</Typography>
                        </Grid>
                    </Grid>
                }/>
                <Tab label={
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Typography variant="h5">Raw Plan</Typography>
                        </Grid>
                    </Grid>
                }/>
            </Tabs>
            {props.children.map((tab, index) => (
                    <CustomTabPanel index={index} value={value}>
                        {tab}
                    </CustomTabPanel>
                )
            )}
        </Box>
    )
}