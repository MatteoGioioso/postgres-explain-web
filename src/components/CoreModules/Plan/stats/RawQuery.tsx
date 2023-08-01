import MainCard from "../MainCard";
import {useState} from "react";
import {Snackbar, Button, Box} from "@mui/material";
import {CopyFilled} from "@ant-design/icons";
import Highlight from 'react-highlight'

export const RawQuery = ({query}: { query: string }) => {
    return (
        <MainCard content={false} sx={{width: 'auto', p: 3}}>
            <Box sx={{pb: 2}}>
                <CopyToClipboardButton data={query} />
            </Box>
            <Highlight className='sql'>
                {query}
            </Highlight>
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
            <Button variant="outlined" size='small' onClick={handleClick} startIcon={<CopyFilled />}>
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