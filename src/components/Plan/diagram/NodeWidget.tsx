import React, {memo} from 'react'
import {Handle, NodeToolbar, Position} from 'reactflow'
import {PlanRow} from '../types'
// @ts-ignore
import Highlight from 'react-highlight'
import {betterNumbers, getCellWarningColor, truncateText} from '../utils'
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
                title={data.node.operation}
                count={truncateText(data.node.scope, 25)}
                percentage={betterNumbers(data.exclusive)}
                extra={`Rows returned: ${betterNumbers(data.rows.total)}`}
                color={getCellWarningColor(data.exclusive, data.execution_time, theme)}
                isLoss={false}/>

            <Handle
                type="source"
                position={Position.Bottom}
                isConnectable={false}
            />
        </>
    )
})

