import {
    Box,
    Button,
    FormHelperText,
    Grid,
    List,
    ListItem,
    ListItemButton, ListItemIcon,
    ListItemText,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {QUERY_EXAMPLE_PLACEHOLDER} from "../utils";
import {Formik} from "formik";
import MainCard from "../CoreModules/MainCard";
import {useNavigate, useParams} from "react-router-dom";
import {analyticsService, queryExplainerService} from "./ioc";
import React, {useEffect, useState} from "react";
import {ConsoleSqlOutlined} from "@ant-design/icons";
import Highlight from 'react-highlight'
import {GenericDetailsPopover} from "../CoreModules/GenericDetailsPopover";
import {QueriesListTable} from "../CoreModules/Tables/QueriesListTable";
import {CopyToClipboardButton} from "../CoreModules/CopyToClipboard";

const Wrapper = ({children, title, sx = {}, other}) => (
    <>
        <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
                <Typography variant="h5">{title}</Typography>
            </Grid>
        </Grid>
        <Box sx={{...sx}}>
            <MainCard
                content={false}
                {...other}
                border
            >
                <Box sx={{p: {xs: 2, sm: 2, md: 2, xl: 2}}}>{children}</Box>
            </MainCard>
        </Box>
    </>
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

const QueryForm = ({cluster_id}) => {
    const navigate = useNavigate();
    return (
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
    )
}

export const ClustersTableAndQueryForm = () => {
    const {cluster_id} = useParams();
    const [plansList, setPlansList] = useState([])
    const [queriesList, setQueriesList] = useState({queries: []})
    const navigate = useNavigate();

    useEffect(() => {
        Promise
            .all([
                queryExplainerService.getQueryPlansList({cluster_name: cluster_id}),
                analyticsService.getQueriesList({cluster_name: cluster_id,})]
            )
            .then(responses => {
                setPlansList(responses[0])
                setQueriesList(responses[1])
            })
            .catch(e => {
                console.error(e)
            })
    }, []);

    const onClickRow = async (queryId, query, params) => {
        try {
            const planID = await queryExplainerService.saveQueryPlan({
                query_id: queryId,
                query,
                cluster_name: cluster_id,
                database: "postgres",
                parameters: params,
            });
            navigate(`/clusters/${cluster_id}/plans/${planID}`)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <>
            <Grid container>
                <Grid item xs={12}>
                    <Wrapper sx={{pr: 2, pt: 2}} title={"Queries list"}>
                        {Boolean(queriesList?.queries?.length) && (
                            <QueriesListTable
                                mappings={queriesList.mappings}
                                queries={queriesList.queries}
                                onClickRow={onClickRow}
                            />
                        )}
                    </Wrapper>
                </Grid>
            </Grid>
            <Box sx={{pt: 4}}/>
            <Grid container>
                <Grid item xs={8}>
                    <Wrapper sx={{pt: 2, pr: 2}} title="Custom query">
                        <QueryForm cluster_id={cluster_id}/>
                    </Wrapper>
                </Grid>
                <Grid item xs={4}>
                    <Wrapper sx={{pt: 2}} title="Plans">
                        {Boolean(plansList?.length) && (
                            <PlansList items={plansList} clusterId={cluster_id}/>
                        )}
                    </Wrapper>
                </Grid>
            </Grid>
        </>
    )
}

export default ClustersTableAndQueryForm