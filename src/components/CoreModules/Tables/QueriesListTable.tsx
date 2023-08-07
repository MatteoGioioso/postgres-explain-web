import React, {useEffect, useState} from 'react'
import {
    Box,
    Button, Grid,
    Modal, Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow,
    TextField,
    Typography
} from '@mui/material'
import Highlight from 'react-highlight'
import {MetricInfo, Query} from "../../SelfHosted/proto/analytics.pb";
import {GenericDetailsPopover} from "../GenericDetailsPopover";
import {truncateText} from "../utils";
import MainCard from "../Plan/MainCard";
import {Formik} from "formik";

export interface MetricsTableProps {
    mappings: MetricInfo[]
    queries: Query[]
    onClickRow: any
}

function Head({mapping}: { mapping: MetricInfo }) {
    return (
        <TableCell
            key={mapping.key}
        >
            <GenericDetailsPopover name={"description"} content={mapping.key}>
                {mapping.Title}
            </GenericDetailsPopover>
        </TableCell>
    );
}

const RowModal = ({open, handleClose, query, onClick}: { open: boolean, handleClose: any, query: Query, onClick: any }) => {
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
                <Typography id="modal-modal-title" variant="h4" component="h2">
                    Explain query
                </Typography>
                <Highlight classname='sql'>
                    {query.text}
                </Highlight>
                {query.parameters?.length > 0 ? (
                    <Formik
                        initialValues={{}}
                        onSubmit={(values, {setErrors, setStatus, setSubmitting}) => {
                            const parameters = Object.keys(values).map(key => values[key]);
                            onClick(query.id, query.text, parameters)
                        }}
                        validate={values => {
                            const errors = {};
                            if (Object.keys(values).length !== query.parameters.length) {
                                query.parameters.forEach(param => {
                                    if (!values[param]) {
                                        errors[param] = 'Required';
                                    }
                                })
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
                        onClick={() => {
                            onClick(query.id, query.text, null)
                        }}
                    >
                        Explain
                    </Button>
                )}
            </MainCard>
        </Modal>
    )
}

const Row = ({query, onClickRow}: { query: Query, onClickRow: any }) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <RowModal open={open} handleClose={handleClose} query={query} onClick={onClickRow}/>
            <TableRow
                hover
                role="checkbox"
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                tabIndex={-1}
                key={query.id}
                onClick={() => {
                    handleOpen()
                }}
            >
                <TableCell>
                    {query.id}
                </TableCell>
                <TableCell>
                    <code>{truncateText(query.text, 50)}</code>
                </TableCell>
                {query.metrics.map((metric, i) => (
                    <TableCell key={i}>
                        {metric.value || "-"}
                    </TableCell>
                ))}
            </TableRow>
        </>
    )
}

export function QueriesListTable({queries, mappings, onClickRow}: MetricsTableProps) {
    const rowsPerPage = 5
    const [page, setPage] = useState(0)
    const [pageData, setPageData] = useState<Query[]>([])
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    useEffect(() => {
        setPageData(queries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage))
    }, [page])

    return (
        <>
            <TableContainer
                sx={{
                    width: '100vw',
                    overflowX: 'auto',
                    position: 'relative',
                    display: 'block',
                    maxWidth: '100%',
                    '& td, & th': {whiteSpace: 'nowrap'}
                }}
            >
                <Table
                    aria-labelledby="tableTitle"
                    sx={{
                        '& .MuiTableCell-root:first-of-type': {
                            pl: 2
                        },
                        '& .MuiTableCell-root:last-of-type': {
                            pr: 3
                        }
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <Head mapping={{key: 'queryid', Title: 'ID'}}/>
                            <Head mapping={{key: 'query', Title: 'Query'}}/>
                            {mappings.map((mapping) => (
                                <Head mapping={mapping}/>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pageData.map((row) => {
                            return <Row query={row} onClickRow={onClickRow}/>
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[]}
                component="div"
                count={queries.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
            />
        </>
    );
}
