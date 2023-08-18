import {Box, Button, IconButton, Modal, Paper, Snackbar, Stack, Typography} from "@mui/material";
import {ShareAltOutlined} from "@ant-design/icons";
import {Link as RouterLink, useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {queryExplainerService} from "./ioc";
import {uploadSharablePlan} from "./utils";
import {PlanUploadErrorDescription, WasmErrorDescription} from "./Errors";
import {ErrorReport} from "../ErrorReporting";
import {ButtonAction, UploadButton} from "../CoreModules/Buttons";
import {PlanForm} from "./PlanForm";
import {ExplainedError} from "../CoreModules/Plan/types";
import {QueryPlan} from "../CoreModules/types";

interface PlanToolbarProps {
    setError: (e: ErrorReport) => void
    plan: QueryPlan
}

export const PlanToolbar = (props: PlanToolbarProps) => {
    const [open, setOpen] = useState<boolean>(false)
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);

    const downloadSharablePlan = () => {
        setOpen(true)

        const queryPlan = queryExplainerService.getQueryPlan(props.plan.id);

        const url = window.URL.createObjectURL(
            new Blob([JSON.stringify(queryPlan, null, 2)]),
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
            'download',
            `${props.plan.id}.json`,
        );

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link)
    }


    return (
        <>
            <Paper
                elevation={0}
                sx={{
                    position: 'absolute',
                    right: 25,
                    top: 75,
                    p: 0.5,
                    border: '1px solid',
                    borderColor: theme => theme.palette.grey['A800'],
                    borderRadius: 2,
                    zIndex: 999
                }}
            >
                <Stack direction='row'>
                    <ButtonAction title="Optimize" onClick={() => setOpenModal(true)}/>

                    <IconButton
                        component={Button}
                        onClick={downloadSharablePlan}
                        color='primary'
                    >
                        <ShareAltOutlined/>
                    </IconButton>

                    <UploadButton
                        color='primary'
                        onUpload={async (e) => {
                            try {
                                const id = await uploadSharablePlan(e);
                                navigate(`/plans/${id}`)
                            } catch (e) {
                                props.setError({
                                    error: e.message,
                                    error_details: "",
                                    error_stack: "",
                                    description: <PlanUploadErrorDescription/>
                                })
                            }
                        }}
                    />
                </Stack>

                <Snackbar
                    anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                    open={open}
                    onClose={() => setOpen(false)}
                    autoHideDuration={2000}
                    message="Downloading plan"
                />
            </Paper>

            <OptimizationFormModal
                plan={props.plan}
                setError={props.setError}
                open={openModal}
                setOpen={setOpenModal}
            />
        </>
    )
}


const modalBoxStyles = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

interface OptimizationFormModalProps {
    plan: QueryPlan,
    setError: (e: ErrorReport) => void
    open: boolean
    setOpen: (b: boolean) => void
}

const OptimizationFormModal = ({plan, setError, setOpen, open}: OptimizationFormModalProps) => {
    const navigate = useNavigate();
    const onSubmitPlanForm = async (values, {setErrors, setStatus, setSubmitting}) => {
        try {
            const planId = await queryExplainerService.saveQueryPlan({
                plan: values.plan,
                alias: values.alias,
                query: values.query,
                optimization_id: plan.optimization_id
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
        } finally {
            setOpen(false)
        }
    }

    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalBoxStyles}>
                <Stack direction='row'>
                    <Typography variant='h4'>Optimization for: </Typography>
                    <Typography sx={{pl: 1}} variant='h4' fontWeight='100'>{plan.id}</Typography>
                </Stack>
                <Typography sx={{pb: 2}} variant='body1'>Write your optimized query here and compare it with the current one</Typography>

                <PlanForm onSubmit={onSubmitPlanForm}/>
            </Box>
        </Modal>
    )
}