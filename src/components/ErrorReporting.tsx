import React from 'react'
import {Alert, AlertTitle, Box, Button, Divider, Link, Typography} from "@mui/material";

export interface ErrorReport {
    message: string
    error_details?: string
    stackTrace?: string
}

export const ErrorAlert = ({error}: {error: ErrorReport}) => {
    const {message, error_details, stackTrace} = error
    return (
        <div>
            <Alert severity="error" action={
                <Button
                    color="inherit"
                    size="small"
                    component={Link}
                    href={`https://github.com/MatteoGioioso/postgres-explain-web/issues/new?title=[Explain web]: add your title (Please attach also the full query plan)&body=${JSON.stringify(error, null, 2)}`}
                >
                    REPORT ISSUE
                </Button>
            }>
                <AlertTitle><Typography variant='h5'>{message}</Typography></AlertTitle>
                <Typography variant='h6'>{error_details}</Typography>

                <Box pt={3}>
                    <Typography variant='h6'>Stack: </Typography>
                    <div>{stackTrace ? stackTrace
                        .split("\n")
                        .map((line, i) => <p key={i} style={{margin: "1px", fontSize: "12px", paddingLeft: 3*i}}>{line}</p>) : '-'}</div>
                </Box>
            </Alert>
        </div>
    )
}