import React, {memo} from 'react'
import {Handle, Position} from 'reactflow'
import {PlanRow} from '../types'
import Node from "./Node";
import {useTheme} from "@mui/material/styles";

export interface NodeWidgetProps {
    data: PlanRow
}

export const NodeWidget = memo(({data}: NodeWidgetProps) => {
    const theme = useTheme();
    return (
        <>
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={false}
                style={{backgroundColor: 'transparent', color: 'transparent'}}
            />
            <Node
                data={data}
                theme={theme}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                isConnectable={false}
            />
        </>
    )
})

