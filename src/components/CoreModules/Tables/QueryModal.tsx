import {Query} from "../../SelfHosted/proto/analytics.pb";
import {Box, Button, FormHelperText, Grid, Modal, Stack, TextField, Typography} from "@mui/material";
import MainCard from "../MainCard";
import {Formik} from "formik";
import React from "react";
import Highlight from 'react-highlight'
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import {Instance} from "../../SelfHosted/proto/info.pb";

export type onClickExplainTopQuery = (fingerprint: string, query: string, parameters: string[], instanceName: string) => void

interface QueryModalProps {
    open: boolean,
    handleClose: any,
    query: Query,
    onClick: onClickExplainTopQuery
    clusterInstancesList: Instance[]
}

export const QueryModal = ({open, handleClose, query, onClick, clusterInstancesList}: QueryModalProps) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{overflow: 'scroll'}}
        >
            <MainCard
                sx={{
                    position: 'absolute' as 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: "70%",
                    bgcolor: 'background.paper',
                    p: 1,
                }}
            >
                <Typography id="modal-modal-title" variant="h5">
                    Explain query: {query.fingerprint}
                </Typography>
                {/*@ts-ignore*/}
                <Highlight classname='sql'>
                    {query.text as string}
                </Highlight>
                {query.parameters?.length > 0 ? (
                    <Formik
                        initialValues={{
                            instanceName: '',
                        }}
                        onSubmit={(values, {setErrors, setStatus, setSubmitting}) => {
                            const parameters = Object.keys(values).filter(key => key.startsWith("$")).map(key => values[key]);
                            onClick(query.id, query.text, parameters, values.instanceName)
                            handleClose()
                        }}
                        validate={values => {
                            const errors = {};
                            if (Object.keys(values).filter(key => key.startsWith("$")).length !== query.parameters.length) {
                                query.parameters.forEach(param => {
                                    if (!values[param]) {
                                        errors[param] = 'Required';
                                    }
                                })
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
                                    {query.parameters.map((param) => (
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
                ) : (
                    <Button
                        disableElevation
                        size="large"
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        Explain
                    </Button>
                )}
            </MainCard>
        </Modal>
    )
}
