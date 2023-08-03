import React, {useEffect, useState} from 'react'
import {
    Box,
    Button, FormHelperText,
    Grid,
    Modal,
    Stack,
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
import {truncateText} from "../Plan/utils";
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
                <Formik
                    initialValues={{parameters: ''}}
                    onSubmit={(values, {setErrors, setStatus, setSubmitting}) => {
                        onClick(query.id, query.text, values.parameters)
                    }}
                >
                    {({errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values}) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                error={Boolean(touched.parameters && errors.parameters)}
                                id="parameters"
                                type="text"
                                value={values.parameters}
                                name="parameters"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                placeholder={"30, 5, 'customer'"}
                                inputProps={{}}
                                multiline
                                rows={1}
                            />
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
                {query.metrics.map(metric => (
                    <TableCell>
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
        setPageData(queries.slice(page*rowsPerPage, page*rowsPerPage+rowsPerPage))
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
