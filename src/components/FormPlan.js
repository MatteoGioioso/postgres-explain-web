import {useContext} from 'react';
import {useNavigate} from 'react-router-dom';

// material-ui
import {
    Box,
    Button,
    FormHelperText,
    Grid,
    Stack,
    TextField, Typography
} from '@mui/material';

// third party
import {Formik} from 'formik';
import {QUERY_PLAN_EXAMPLE_PLACEHOLDER} from "./utils";

// project import
import MainCard from './CoreModules/Plan/MainCard';
import {PlanContext} from "../MainContext";

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

const AuthWrapper = ({children}) => (
    <Box sx={{minHeight: '100vh'}}>
        <Grid item>
            <AuthCard>{children}</AuthCard>
        </Grid>
    </Box>
);


// ==============================|| AUTHENTICATION - CARD WRAPPER ||============================== //

const AuthCard = ({children, ...other}) => (
    <MainCard
        content={false}
        {...other}
        border={false}
        boxShadow
    >
        <Box sx={{p: {xs: 2, sm: 3, md: 4, xl: 5}}}>{children}</Box>
    </MainCard>
);


// ============================|| FIREBASE - REGISTER ||============================ //

const FormPlan = () => {
    const {setPlan} = useContext(PlanContext);
    const navigate = useNavigate();

    return (
        <AuthWrapper>
            <Formik
                initialValues={{
                    plan: ''
                }}
                onSubmit={async (values, {setErrors, setStatus, setSubmitting}) => {
                    setPlan(values.plan)
                    navigate('/plan')
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
                                        value={values.email}
                                        name="plan"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder={QUERY_PLAN_EXAMPLE_PLACEHOLDER}
                                        inputProps={{}}
                                        multiline
                                        rows={30}
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
                                    Postgres explain uses wasm and does not have a backend. <b>I do not save any of the information provided
                                    in this form</b>.
                                </Typography>
                                <Typography variant="body2">
                                    For the time being all your query plans, query and schemas are stored in the client. If any changes to
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
        </AuthWrapper>
    );
};

export default FormPlan;
