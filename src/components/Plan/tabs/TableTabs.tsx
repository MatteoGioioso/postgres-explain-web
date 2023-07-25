import {Grid, Tab, Typography, Tabs, Box} from "@mui/material";
import React, {useContext} from "react";
import {TableTabsContext} from "../Contexts";

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

export function UnmountableTabPanel(props) {
    const {children, value, index, ...other} = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`diagram-tabpanel-${index}`}
            aria-labelledby={`diagram-tab-${index}`}
            {...other}
        >
            {children}
        </div>
    );
}

export const TableTabs = (props) => {
    const {tabIndex, setTabIndex} = useContext(TableTabsContext);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <Box sx={{width: '100%'}}>
            <Tabs
                value={tabIndex}
                onChange={handleChange}
                aria-label="table tabs"

            >
                <Tab
                    label={
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Typography variant="h5">Diagram</Typography>
                            </Grid>
                        </Grid>
                    }
                />
                <Tab
                    label={
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Typography variant="h5">Table</Typography>
                            </Grid>
                        </Grid>
                    }
                />
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
            {props.children.map((tab, index) => index == 0 ? (
                    <UnmountableTabPanel index={index} value={tabIndex}>
                        {tab}
                    </UnmountableTabPanel>
                ) : (
                    <CustomTabPanel index={index} value={tabIndex}>
                        {tab}
                    </CustomTabPanel>
                )
            )}
        </Box>
    )
}