import React, {memo} from 'react'
import {Handle, NodeToolbar, Position} from 'reactflow'
import {PlanRow, Stats} from '../types'
import Node from "./Node";
import {useTheme} from "@mui/material/styles";
import {IconButton} from "@mui/material";
import {CloseOutlined} from "@ant-design/icons";
import {useFocus} from "../hooks";


export interface NodeData {
    row: PlanRow
    stats: Stats
}

export interface NodeWidgetProps {
    data: NodeData
}

export const NodeWidget = memo(({data}: NodeWidgetProps) => {
    const theme = useTheme()
    const {closeFocusNavigation, isFocused} = useFocus(data.row.node_id);

    return (
        <>
            <Handle
                type="source"
                position={Position.Top}
                isConnectable={false}
                style={{backgroundColor: 'transparent', color: 'transparent'}}
            />
            <NodeToolbar isVisible={isFocused} position={Position.Right}>
                <IconButton onClick={closeFocusNavigation}>
                    <CloseOutlined style={{fontSize: '0.90rem', color: 'inherit'}}/>
                </IconButton>
            </NodeToolbar>
            <Node
                data={data.row}
                theme={theme}
                stats={data.stats}
            />
            <Handle
                type="target"
                position={Position.Bottom}
                isConnectable={false}
                style={{backgroundColor: 'transparent', color: 'transparent'}}
            />
        </>
    )
})

