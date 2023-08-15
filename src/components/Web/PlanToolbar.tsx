import {Button, IconButton, Paper, Snackbar, Stack} from "@mui/material";
import {ShareAltOutlined} from "@ant-design/icons";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";

export const PlanToolbar = (props) => {
    const {plan_id} = useParams();
    const [open, setOpen] = useState<boolean>(false)

    const createPlanSharableLink = () => {
        const host = window.location.host;
        const link = `${host}/plans/${plan_id}`
        navigator.clipboard.writeText(link)
        setOpen(true)
    }

    useEffect(() => {

    }, []);

    return (
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
                <IconButton
                    component={Button}
                    onClick={createPlanSharableLink}
                >
                    <ShareAltOutlined/>
                </IconButton>
            </Stack>

            <Snackbar
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                open={open}
                onClose={() => setOpen(false)}
                autoHideDuration={2000}
                message="Sharable link copied to clipboard"
            />
        </Paper>
    )
}