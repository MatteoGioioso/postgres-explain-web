import * as React from 'react';
import {styled} from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import {UploadOutlined} from "@ant-design/icons";
import {uploadSharablePlan} from "./utils";

const Input = styled('input')({
    display: 'none',
});

export function UploadButton({onUpload}: {onUpload: any}) {
    return (
        <label htmlFor="icon-button-file">
            <Input accept="application/json" id="icon-button-file" type="file" onInput={onUpload}/>
            <IconButton
                color="secondary"
                aria-label="upload plan"
                component="span"
            >
                <UploadOutlined/>
            </IconButton>
        </label>
    );
}