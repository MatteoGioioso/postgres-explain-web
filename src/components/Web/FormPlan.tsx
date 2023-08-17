import {ReactNode, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    Box,
    Button,
    FormHelperText,
    Grid, IconButton, Input, Paper,
    Stack,
    TextField, Typography
} from '@mui/material';
import {Formik} from 'formik';
import {QUERY_EXAMPLE_PLACEHOLDER, QUERY_PLAN_EXAMPLE_PLACEHOLDER} from "../utils";
import MainCard from '../CoreModules/MainCard';
import {queryExplainerService} from "./ioc";
import {ErrorAlert, ErrorReport} from "../ErrorReporting";

import {PlansList} from "../CoreModules/PlansList";
import InputLabel from "@mui/material/InputLabel";
import {ExplainedError} from "../CoreModules/Plan/types";
import {PlanUploadErrorDescription, WasmErrorDescription} from "./Errors";
import {UploadButton} from "./UploadButton";
import {uploadSharablePlan} from "./utils";


const FormWrapper = ({children}) => (
    <Box sx={{minHeight: '100vh'}}>
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
    >
        <Box sx={{p: {xs: 2, sm: 3, md: 4, xl: 5}}}>{children}</Box>
    </MainCard>
);

const FormPlan = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<ErrorReport>();
    const [plansList, setPlansList] = useState([])

    useEffect(() => {
        setPlansList(queryExplainerService.getQueryPlansList());
    }, []);

    const onDeleteQueryPlan = (item) => {
        queryExplainerService.deleteQueryPlanById(item.id)
        setPlansList(queryExplainerService.getQueryPlansList());
    }

    return (
        <>
            {error && (
                <Box sx={{pb: 2}}>
                    <ErrorAlert error={error} setError={setError}/>
                </Box>
            )}
            <Grid container>
                <Grid item xs={8}>
                    <FormWrapper>
                        <Formik
                            initialValues={{
                                plan: '',
                                alias: '',
                                query: ''
                            }}
                            onSubmit={async (values, {setErrors, setStatus, setSubmitting}) => {
                                try {
                                    const planId = await queryExplainerService.saveQueryPlan({
                                        plan: values.plan,
                                        alias: values.alias,
                                        query: values.query,
                                    });
                                    navigate(`/plans/${planId}`)
                                } catch (e) {
                                    try {
                                        const out: ExplainedError = JSON.parse(e.message);
                                        setError({
                                            ...out,
                                            description: <WasmErrorDescription error={out}/>
                                        })
                                    } catch (_) {
                                        setError({
                                            error: e.message,
                                            error_details: "",
                                            error_stack: e.stack,
                                        })
                                    }
                                }
                            }}
                            validate={values => {
                                const errors = {};
                                if (!values.plan) {
                                    // @ts-ignore
                                    errors.plan = 'Required';
                                }

                                return errors;
                            }}
                        >
                            {({errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values}) => (
                                <form noValidate onSubmit={handleSubmit}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Stack spacing={2}>
                                                <Stack spacing={0}>
                                                    <InputLabel htmlFor="alias">Alias</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        id="alias"
                                                        type="text"
                                                        value={values.alias}
                                                        name="alias"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        placeholder={'Plan alias'}
                                                        inputProps={{}}
                                                        rows={1}
                                                    />
                                                </Stack>

                                                <Stack spacing={0}>
                                                    <InputLabel htmlFor="plan">Plan*</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        error={Boolean(touched.plan && errors.plan)}
                                                        id="plan"
                                                        type="text"
                                                        value={values.plan}
                                                        name="plan"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        placeholder={QUERY_PLAN_EXAMPLE_PLACEHOLDER}
                                                        inputProps={{}}
                                                        multiline
                                                        rows={15}
                                                    />
                                                </Stack>

                                                <Stack spacing={0}>
                                                    <InputLabel htmlFor="query">Query</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        id="query"
                                                        type="text"
                                                        value={values.query}
                                                        name="query"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        placeholder={QUERY_EXAMPLE_PLACEHOLDER}
                                                        inputProps={{}}
                                                        multiline
                                                        rows={4}
                                                    />
                                                </Stack>

                                                {touched.plan && errors.plan && (
                                                    <FormHelperText error id="helper-text-plan-signup">
                                                        {errors.plan as ReactNode}
                                                    </FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="body1">
                                                Postgres explain uses wasm and does not have a backend. <b>I do not save any of the
                                                information
                                                provided
                                                in this form</b>.
                                            </Typography>
                                            <Typography variant="body2">
                                                For the time being all your query plans, query and schemas are stored in the client. If any
                                                changes to
                                                this behaviour will occur, you will be notified.
                                            </Typography>
                                        </Grid>
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
                </Grid>
                <Grid item xs={4}>
                    <Box sx={{pl: 2, pb: 2}}>
                        <Paper
                            elevation={0}
                            sx={{borderColor: theme => theme.palette.grey['A800'],}}
                        >
                            <Stack spacing={0}>
                                <UploadButton
                                    onUpload={async (e) => {
                                        try {
                                            const id = await uploadSharablePlan(e);
                                            navigate(`/plans/${id}`)
                                        } catch (e) {
                                            setError({
                                                error: e.message,
                                                error_details: "",
                                                error_stack: "",
                                                description: <PlanUploadErrorDescription />
                                            })
                                        }
                                    }}
                                />
                            </Stack>
                        </Paper>
                    </Box>
                    <Box sx={{pl: 2}}>
                        <PlansList
                            items={plansList}
                            onClick={(item) => {
                                navigate(`/plans/${item.id}`)
                            }}
                            onDelete={onDeleteQueryPlan}
                        />
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

export default FormPlan;
