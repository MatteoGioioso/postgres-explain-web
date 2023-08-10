import {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    Box,
    Button,
    FormHelperText,
    Grid,
    Stack,
    TextField, Typography
} from '@mui/material';
import {Formik} from 'formik';
import {QUERY_PLAN_EXAMPLE_PLACEHOLDER} from "../utils";
import MainCard from '../CoreModules/MainCard';
import {queryExplainerService} from "./ioc";
import {ErrorAlert} from "../ErrorReporting";
import {PlansList} from "../SelfHosted/ClustersTableAndQueryForm";


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
    const [error, setError] = useState();
    const [plansList, setPlansList] = useState([])

    useEffect(() => {
        setPlansList(queryExplainerService.getQueryPlansList());
    }, []);

    return (
        <Grid container>
            <Grid item xs={8}>
                <FormWrapper>
                    {error && (
                        <Box sx={{pb: 2}}>
                            <ErrorAlert error={error}/>
                        </Box>
                    )}
                    <Formik
                        initialValues={{
                            plan: ''
                        }}
                        onSubmit={async (values, {setErrors, setStatus, setSubmitting}) => {
                            try {
                                const planId = await queryExplainerService.saveQueryPlan({
                                    plan: values.plan
                                });
                                navigate(`/plan/${planId}`)
                            } catch (e) {
                                try {
                                    const out = JSON.parse(e);
                                    setError({
                                        message: out.error,
                                        error_details: out.error_details,
                                        stackTrace: out.error_stack,
                                    })
                                } catch (_) {
                                    setError({
                                        message: e.message,
                                        error_details: "",
                                        stackTrace: e.stack,
                                    })
                                }
                            }
                        }}
                        validate={values => {
                            const errors = {};
                            if (!values.plan) {
                                errors.plan = 'Required';
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
                                                error={Boolean(touched.plan && errors.plan)}
                                                id="plan"
                                                type="text"
                                                value={values.query}
                                                name="plan"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={QUERY_PLAN_EXAMPLE_PLACEHOLDER}
                                                inputProps={{}}
                                                multiline
                                                maxRows={100}
                                            />
                                            {touched.plan && errors.plan && (
                                                <FormHelperText error id="helper-text-plan-signup">
                                                    {errors.plan}
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
                                        <Typography variant="body1">
                                            Postgres explain uses wasm and does not have a backend. <b>I do not save any of the information
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
                <Box sx={{pl: 2}}>
                    <PlansList
                        items={plansList}
                        onClick={(item) => {
                            navigate(`/plan/${item.id}`)
                        }}
                    />
                </Box>
            </Grid>
        </Grid>
    );
};

export default FormPlan;
