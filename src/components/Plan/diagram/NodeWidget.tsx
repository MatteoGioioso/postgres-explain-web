import React, {memo} from 'react'
import {Handle, NodeToolbar, Position} from 'reactflow'
import {PlanRow} from '../types'
// @ts-ignore
import Highlight from 'react-highlight'
import {betterNumbers, getPercentageColor, truncateText} from '../utils'
import Node from "./Node";
import {useTheme} from "@mui/material/styles";

// @ts-ignore
export const NodeWidget = memo(({data, isConnectable}: { data: PlanRow }) => {
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

