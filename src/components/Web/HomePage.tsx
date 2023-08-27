import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {ErrorAlert, ErrorReport} from "../ErrorReporting";
import {queryExplainerService} from "./ioc";
import {Box, Grid, IconButton, Paper, Stack} from "@mui/material";
import {PlanForm} from "../CoreModules/PlanForm";
import {ButtonAction, UploadButton} from "../CoreModules/Buttons";
import {uploadSharablePlan} from "./utils";
import {PlanUploadErrorDescription, WasmErrorDescription} from "./Errors";
import {PlansList} from "../CoreModules/PlansList";
import MainCard from "../CoreModules/MainCard";
import {ExplainedError} from "../CoreModules/Plan/types";
import {ShareAltOutlined} from "@ant-design/icons";


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


const HomePage = () => {
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

    const onSubmitPlanForm = async (values, {setErrors, setStatus, setSubmitting}) => {
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
                        <PlanForm onSubmit={onSubmitPlanForm}/>
                    </FormWrapper>
                </Grid>
                <Grid item xs={4}>
                    <Box sx={{pl: 2, pb: 2}}>
                        <Paper
                            elevation={0}
                            sx={{borderColor: theme => theme.palette.grey['A800'], p: 1}}
                        >
                            <Stack spacing={0} direction='row'>
                                <UploadButton
                                    color='primary'
                                    onUpload={async (e) => {
                                        try {
                                            const id = await uploadSharablePlan(e);
                                            navigate(`/plans/${id}`)
                                        } catch (e) {
                                            setError({
                                                error: e.message,
                                                error_details: "",
                                                error_stack: "",
                                                description: <PlanUploadErrorDescription/>
                                            })
                                        }
                                    }}
                                />
                                <ButtonAction icon={<ShareAltOutlined />} />
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

export default HomePage;