import {Button, IconButton, Paper, Snackbar, Stack} from "@mui/material";
import {ShareAltOutlined} from "@ant-design/icons";
import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {queryExplainerService} from "./ioc";
import {UploadButton} from "./UploadButton";
import {uploadSharablePlan} from "./utils";
import {PlanUploadErrorDescription} from "./Errors";
import {ErrorReport} from "../ErrorReporting";

interface PlanToolbarProps {
    setError: (e: ErrorReport) => void
}

export const PlanToolbar = (props: PlanToolbarProps) => {
    const {plan_id} = useParams();
    const [open, setOpen] = useState<boolean>(false)
    const navigate = useNavigate();

    const downloadSharablePlan = () => {
        setOpen(true)

        const queryPlan = queryExplainerService.getQueryPlan(plan_id);

        const url = window.URL.createObjectURL(
            new Blob([JSON.stringify(queryPlan, null, 2)]),
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
            'download',
            `${plan_id}.json`,
        );

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link)
    }


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
                    onClick={downloadSharablePlan}
                >
                    <ShareAltOutlined />
                </IconButton>

                <UploadButton
                    onUpload={async (e) => {
                        try {
                            const id = await uploadSharablePlan(e);
                            navigate(`/plans/${id}`)
                        } catch (e) {
                            props.setError({
                                error: e.message,
                                error_details: "",
                                error_stack: "",
                                description: <PlanUploadErrorDescription />
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
    )
}