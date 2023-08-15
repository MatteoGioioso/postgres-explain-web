import {Box, Button, Link} from "@mui/material";
import React from "react";
import {ExplainedError} from "../CoreModules/Plan/types";
import {useNavigate} from "react-router-dom";

export const PlanNotFoundErrorDescription = () => {
    const navigate = useNavigate();
    return (
        <div>Someone has probably shared this link with you, however Postgres Explain web does not use servers. <br/>
            If you want the plan to be shareable you have two options:
            <ul>
                <li>Use export/import to share plan data</li>
                <li>Sign-up and pay a small donation so I can store your plans in a database</li>
            </ul>
            <Button
                variant='outlined'
                onClick={() => navigate('/')}
            >
                + New Plan
            </Button>
        </div>
    )
}

export const WasmErrorDescription = ({error}: { error: ExplainedError }) => {
    return (
        <Box sx={{pt: 2}}>
            <Button
                variant='outlined'
                color="inherit"
                size="small"
                component={Link}
                href={`https://github.com/MatteoGioioso/postgres-explain-web/issues/new?title=[Explain web]: add your title (Please attach also the full query plan)&body=${JSON.stringify(error, null, 2)}`}
                target='_blank'
            >
                REPORT ISSUE
            </Button>
        </Box>
    )
}