import {Grid, Tab, Typography, Tabs, Box} from "@mui/material";
import React, {useContext, useEffect} from "react";
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

interface TabProp {
    name: string
    component: () => React.JSX.Element
    show: boolean
}

interface TableTabsProps {
    tabs: TabProp[]
}

function RenderTab(index: number, tab: TabProp, tabIndex: number) {
    return index === 0 ? (
        <UnmountableTabPanel key={tab.name} index={index} value={tabIndex}>
            {tab.component()}
        </UnmountableTabPanel>
    ) : (
        <CustomTabPanel key={tab.name} index={index} value={tabIndex}>
            {tab.component()}
        </CustomTabPanel>
    );
}

export const TableTabs = (props: TableTabsProps) => {
    const {tabIndex, setTabIndex} = useContext(TableTabsContext);

    useEffect(() => {
        setTabIndex(0)
    }, []);

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
                {props.tabs.filter(t => t.show).map(t => (
                    <Tab
                        key={t.name}
                        label={
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Typography variant="h5">{t.name}</Typography>
                                </Grid>
                            </Grid>
                        }
                    />
                ))}
            </Tabs>
            {props.tabs
                .filter(tab => tab.show)
                .map((tab, index) => RenderTab(index, tab, tabIndex))
            }
        </Box>
    )
}