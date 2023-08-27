import {Box, Button, Divider, IconButton, Link, Modal, Paper, Snackbar, Stack, Typography} from "@mui/material";
import {ShareAltOutlined} from "@ant-design/icons";
import React, {useContext, useState} from "react";
import {ButtonAction, UploadButton} from "../Buttons";
import {PlanForm} from "../PlanForm";
import {QueryPlan} from "../types";
import {FormikHelpers} from "formik/dist/types";
import {betterTiming, getPercentageColor} from "../utils";
import {TableTabsContext} from "./Contexts";

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

type onSubmitOptimizationPlanForm = (afterSubmitCallback: () => void) => (values: any, formikHelpers: FormikHelpers<any>) => void | Promise<any>

interface OptimizationFormModalProps {
    plan: QueryPlan,
    open: boolean
    setOpen: (b: boolean) => void
    onSubmitOptimizationPlanForm: onSubmitOptimizationPlanForm
}

interface PlanToolbarProps {
    plan: QueryPlan
    onSubmitOptimizationPlanForm: onSubmitOptimizationPlanForm
    uploadSharedPlan: (event: React.SyntheticEvent) => Promise<string>
    sharePlan: (planId: string) => void
}

export const PlanToolbar = ({plan, sharePlan, onSubmitOptimizationPlanForm, uploadSharedPlan}: PlanToolbarProps) => {
    const [open, setOpen] = useState<boolean>(false)
    const [openModal, setOpenModal] = useState(false);
    const {tabIndex, setTabIndex} = useContext(TableTabsContext);

    return (
        <>
            <Paper
                elevation={0}
                sx={{
                    p: 0.5,
                    border: '1px solid',
                    borderColor: theme => theme.palette.grey['A800'],
                    borderRadius: 2,
                }}
            >
                <Stack direction='row'>

                    <Stack direction='row' divider={<Divider orientation="vertical" flexItem/>}>
                        <Typography sx={{p: 1, whiteSpace: 'nowrap'}}>Execution
                            time: <b>{betterTiming(plan.stats.execution_time)}</b></Typography>
                        <Typography sx={{p: 1, whiteSpace: 'nowrap'}}>Planning
                            time: <b>{betterTiming(plan.stats.planning_time)}</b></Typography>
                        {Boolean(plan.jit_stats) && (
                            <>
                                <Typography
                                    sx={{pt: 1, pb: 1, pl: 1, color: theme => theme.palette.primary.main, cursor: 'pointer'}}
                                    onClick={() => setTabIndex(2)}
                                >
                                    JIT
                                </Typography>
                                <Typography sx={{pt: 1, pb: 1, pr: 1}}>:</Typography>
                                <Typography
                                    sx={{
                                        whiteSpace: 'nowrap',
                                        p: 1,
                                        borderRadius: 2,
                                        backgroundColor: theme => getPercentageColor(plan.jit_stats.Timing.Total, plan.stats.execution_time, theme)
                                    }}
                                >
                                    <b>{betterTiming(plan.jit_stats.Timing.Total)}</b>
                                </Typography>
                            </>

                        )}
                        {Boolean(plan.triggers_stats) && (
                            <>
                                <Typography
                                    sx={{pt: 1, pb: 1, pl: 1, color: theme => theme.palette.primary.main, cursor: 'pointer'}}
                                    onClick={() => setTabIndex(2)}
                                >
                                    Triggers
                                </Typography>
                                <Typography sx={{pt: 1, pb: 1, pr: 1}}>:</Typography>
                                <Typography
                                    sx={{
                                        whiteSpace: 'nowrap',
                                        p: 1,
                                        borderRadius: 2,
                                        backgroundColor: theme => getPercentageColor(plan.triggers_stats.max_time, plan.stats.execution_time, theme)
                                    }}
                                >
                                    <b>{betterTiming(plan.triggers_stats.max_time)}</b>
                                </Typography>
                            </>
                        )}
                    </Stack>

                    <Stack direction='row'>
                        <ButtonAction title="Optimize" onClick={() => setOpenModal(true)}/>

                        <IconButton
                            component={Button}
                            onClick={() => {
                                setOpen(true)
                                sharePlan(plan.id)
                            }}
                            color='primary'
                        >
                            <ShareAltOutlined/>
                        </IconButton>

                        <UploadButton
                            color='primary'
                            onUpload={uploadSharedPlan}
                        />
                    </Stack>

                    <Snackbar
                        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                        open={open}
                        onClose={() => setOpen(false)}
                        autoHideDuration={2000}
                        message="Downloading plan"
                    />


                </Stack>
            </Paper>

            <OptimizationFormModal
                plan={plan}
                open={openModal}
                setOpen={setOpenModal}
                onSubmitOptimizationPlanForm={onSubmitOptimizationPlanForm}
            />
        </>
    )
}

const OptimizationFormModal = ({plan, setOpen, open, onSubmitOptimizationPlanForm}: OptimizationFormModalProps) => {
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

                <PlanForm onSubmit={onSubmitOptimizationPlanForm(() => setOpen(false))}/>
            </Box>
        </Modal>
    )
}