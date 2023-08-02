import {
    Avatar,
    Box,
    Button,
    FormHelperText,
    Grid,
    List,
    ListItem,
    ListItemAvatar, ListItemButton, ListItemIcon,
    ListItemText, ListSubheader,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {QUERY_EXAMPLE_PLACEHOLDER, QUERY_PLAN_EXAMPLE_PLACEHOLDER} from "../utils";
import {Formik} from "formik";
import MainCard from "../CoreModules/Plan/MainCard";
import {useNavigate, useParams} from "react-router-dom";
import {queryExplainerService} from "./ioc";
import React, {useEffect, useState} from "react";
import {GenericDetailsPopover} from "../CoreModules/Plan/table/Cells";
import {ConsoleSqlOutlined} from "@ant-design/icons";
import {CopyToClipboardButton, RawQuery} from "../CoreModules/Plan/stats/RawQuery";
import Highlight from 'react-highlight'

const FormWrapper = ({children}) => (
    <Box sx={{pb: 2, pt: 2}}>
        <Grid item>
            <FormCard>{children}</FormCard>
        </Grid>
    </Box>
);

const FormCard = ({children, ...other}) => (
    <MainCard
        content={false}
        {...other}
        border={false}
        boxShadow
    >
        <Box sx={{p: {xs: 2, sm: 3, md: 4, xl: 5}}}>{children}</Box>
    </MainCard>
);

export function PlansList(props) {
    const navigate = useNavigate();

    return (
        <List
            sx={{width: '100%', bgcolor: 'background.paper'}}
        >
            {props.items.map(item => (
                <ListItem disablePadding>
                    <ListItemButton onClick={() => {
                        navigate(`/clusters/${props.clusterId}/plans/${item.id}`)
                    }}>
                        <ListItemText primary={item.id} secondary={item.period_start.toISOString()}/>
                    </ListItemButton>
                    <GenericDetailsPopover
                        name={"query"}
                        content={
                            <>
                                <Box sx={{pb: 2}}>
                                    <CopyToClipboardButton data={item.query}/>
                                </Box>
                                <Highlight className='sql'>
                                    {item.query}
                                </Highlight>
                            </>
                        }
                    >
                        <ListItemIcon>
                            <ConsoleSqlOutlined/>
                        </ListItemIcon>
                    </GenericDetailsPopover>
                </ListItem>
            ))}
        </List>
    );
}

export const ClustersTableAndQueryForm = () => {
    const {cluster_id} = useParams();
    const navigate = useNavigate();
    const [plansList, setPlansList] = useState([])

    useEffect(() => {
        queryExplainerService.getQueryPlansList({
            cluster_name: cluster_id
        }).then(plansList => {
            setPlansList(plansList)
        })
    }, []);

    return (
        <>
            <Grid container>
                <Grid xs={8}>

                </Grid>
                <Grid xs={4}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Typography variant="h5">Plans</Typography>
                        </Grid>
                    </Grid>
                    <FormWrapper>
                        {Boolean(plansList.length) && (
                            <PlansList items={plansList} clusterId={cluster_id}/>
                        )}
                    </FormWrapper>
                </Grid>
            </Grid>
            <Box sx={{pt: 2}}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Custom query</Typography>
                    </Grid>
                </Grid>
                <FormWrapper>
                    <Formik
                        initialValues={{
                            plan: ''
                        }}
                        onSubmit={async (values, {setErrors, setStatus, setSubmitting}) => {
                            const planID = await queryExplainerService.saveQueryPlan({
                                query: values.query,
                                cluster_name: cluster_id,
                                database: "postgres",
                            });
                            navigate(`/clusters/${cluster_id}/plans/${planID}`)
                        }}
                        validate={values => {
                            const errors = {};
                            if (!values.query) {
                                errors.query = 'Required';
                            }
                            return errors;
                        }}
                    >
                        {({errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values}) => (
                            <form noValidate onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <TextField
                                                fullWidth
                                                error={Boolean(touched.query && errors.query)}
                                                id="query"
                                                type="text"
                                                value={values.query}
                                                name="query"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={QUERY_EXAMPLE_PLACEHOLDER}
                                                inputProps={{}}
                                                multiline
                                                rows={10}
                                            />
                                            {touched.query && errors.query && (
                                                <FormHelperText error id="helper-text-plan-signup">
                                                    {errors.query}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    {errors.submit && (
                                        <Grid item xs={12}>
                                            <FormHelperText error>{errors.submit}</FormHelperText>
                                        </Grid>
                                    )}
                                    <Grid item xs={12}>
                                        <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit"
                                                variant="contained"
                                                color="primary">
                                            Explain
                                        </Button>
                                    </Grid>

                                </Grid>
                            </form>
                        )}
                    </Formik>
                </FormWrapper>
            </Box>
        </>
    )
}

export default ClustersTableAndQueryForm