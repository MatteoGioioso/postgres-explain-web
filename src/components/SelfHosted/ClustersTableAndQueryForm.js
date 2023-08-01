import {Box, Button, FormHelperText, Grid, Stack, TextField, Typography} from "@mui/material";
import {QUERY_EXAMPLE_PLACEHOLDER, QUERY_PLAN_EXAMPLE_PLACEHOLDER} from "../utils";
import {Formik} from "formik";
import MainCard from "../CoreModules/Plan/MainCard";
import {useNavigate, useParams} from "react-router-dom";
import {queryExplainerService} from "./ioc";

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
        boxShadow
    >
        <Box sx={{p: {xs: 2, sm: 3, md: 4, xl: 5}}}>{children}</Box>
    </MainCard>
);

export const ClustersTableAndQueryForm = () => {
    const {cluster_id} = useParams();
    const navigate = useNavigate();

    return (
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
                                        rows={30}
                                        maxRows={100}
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
    )
}

export default ClustersTableAndQueryForm