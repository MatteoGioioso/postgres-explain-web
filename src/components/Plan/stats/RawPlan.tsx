import MainCard from "../MainCard";
import ReactJson from 'react-json-view'
import {useState} from "react";
import {Snackbar, Button, Box} from "@mui/material";
import {CopyFilled} from "@ant-design/icons";

export const RawPlan = ({plan}: { plan: any }) => {
    return (
        <MainCard content={false} sx={{width: '70vw', p: 3}}>
            <Box sx={{pb: 2}}>
                <CopyToClipboardButton data={plan} />

            </Box>
            <ReactJson src={JSON.parse(plan)}/>
        </MainCard>
    )
}

const CopyToClipboardButton = (props) => {
    const [open, setOpen] = useState(false)

    const handleClick = () => {
        setOpen(true)
        navigator.clipboard.writeText(props.data)
    }

    return (
        <>
            <Button variant="outlined" onClick={handleClick} startIcon={<CopyFilled />}>
                Copy
            </Button>
            <Snackbar
                open={open}
                onClose={() => setOpen(false)}
                autoHideDuration={2000}
                message="Copied to clipboard"
            />
        </>
    )
}