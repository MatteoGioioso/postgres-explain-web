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
                {props.tabs.map(t => (
                    <Tab
                        key={t}
                        label={
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Typography variant="h5">{t}</Typography>
                                </Grid>
                            </Grid>
                        }
                    />
                ))}
            </Tabs>
            {props.children.map((tab, index) => index == 0 ? (
                    <UnmountableTabPanel key={index} index={index} value={tabIndex}>
                        {tab}
                    </UnmountableTabPanel>
                ) : (
                    <CustomTabPanel key={index} index={index} value={tabIndex}>
                        {tab}
                    </CustomTabPanel>
                )
            )}
        </Box>
    )
}