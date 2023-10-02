import {Query} from "../../SelfHosted/proto/analytics.pb";
import {Box, Button, Dialog, DialogContent, DialogTitle, FormHelperText, Grid, Modal, Stack, TextField, Typography} from "@mui/material";
import MainCard from "../MainCard";
import {Formik} from "formik";
import React from "react";
import Highlight from 'react-highlight'
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import {Instance} from "../../SelfHosted/proto/info.pb";
import {TableData} from "../../SelfHosted/services/Activities.service";

export type onClickExplainTopQuery = (fingerprint: string, parameters: string[], instanceName: string) => void

interface QueryModalProps {
    open: boolean,
    handleClose: any,
    tableData: TableData,
    onClick: onClickExplainTopQuery
    clusterInstancesList: Instance[]
}

export const QueryModal = ({open, handleClose, tableData, onClick, clusterInstancesList}: QueryModalProps) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            scroll="paper"
            sx={{minWidth: '50vw'}}
            fullWidth
        >
            <DialogTitle>
                <Typography id="modal-modal-title" variant="h5">
                    Explain query: {tableData.fingerprint}
                </Typography>
            </DialogTitle>
            <DialogContent>
                {/*@ts-ignore*/}
                <Highlight classname='sql'>
                    {tableData.name as string}
                </Highlight>
                <Formik
                    initialValues={{
                        instanceName: '',
                    }}
                    onSubmit={(values, {setErrors, setStatus, setSubmitting}) => {
                        const parameters = Object.keys(values).filter(key => key.startsWith("$")).map(key => values[key]);
                        onClick(tableData.fingerprint, parameters, values.instanceName)
                        handleClose()
                    }}
                    validate={values => {
                        const errors = {};
                        if (tableData.parameters) {
                            const areThereAnyParameters = Object
                                .keys(values)
                                .filter(key => key.startsWith("$"))?.length !== tableData.parameters.length;

                            if (areThereAnyParameters) {
                                tableData.parameters.forEach(param => {
                                    if (!values[param]) {
                                        errors[param] = 'Required';
                                    }
                                })
                            }
                        }

                        if (!values.instanceName) {
                            // @ts-ignore
                            errors.instanceName = 'Required';
                        }

                        return errors;
                    }}
                >
                    {({errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values}) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={1}>
                                {tableData.parameters?.map((param) => (
                                    <Grid item xs={2} display='inline-flex'>
                                        <Typography sx={{pr: 2}}>
                                            {param}=
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            error={Boolean(errors[param])}
                                            id={param}
                                            type="text"
                                            value={values[param]}
                                            name={param}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            inputProps={{}}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                            <Box sx={{pt: 2}}/>

                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <InputLabel htmlFor="instanceName">Instances*</InputLabel>
                                    <TextField
                                        select
                                        fullWidth
                                        id="instanceName"
                                        type="text"
                                        value={values.instanceName}
                                        name="instanceName"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{}}
                                        error={Boolean(touched.instanceName && errors.instanceName)}
                                    >
                                        {clusterInstancesList.map(instance => (
                                            <MenuItem key={instance.id} value={instance.id}>
                                                {instance.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    {touched.instanceName && errors.instanceName && (
                                        <FormHelperText error id="helper-text-plan-signup">
                                            {errors.instanceName as string}
                                        </FormHelperText>
                                    )}
                                </Grid>
                            </Grid>
                            <Box sx={{pt: 2}}/>

                            <Button
                                disableElevation
                                size="large"
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                Explain
                            </Button>
                        </form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    )
}
