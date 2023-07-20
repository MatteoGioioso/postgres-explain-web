import React, {memo} from 'react'
import {Handle, NodeToolbar, Position} from 'reactflow'
import {PlanRow, Stats} from '../types'
import Node from "./Node";
import {useTheme} from "@mui/material/styles";
import {IconButton} from "@mui/material";
import {CloseOutlined, DownOutlined, TableOutlined} from "@ant-design/icons";
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
    const {goToParentNode, closeFocusNavigation, isFocused, switchToRow} = useFocus(data.row.node_id);

    return (
        <>
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={false}
                style={{backgroundColor: 'transparent', color: 'transparent'}}
            />
            <NodeToolbar isVisible={isFocused} position={Position.Right}>
                {data.row.node_parent_id && (
                    <IconButton onClick={() => goToParentNode(data.row.node_parent_id)}>
                        <DownOutlined style={{fontSize: '0.90rem', color: 'inherit'}}/>
                    </IconButton>)
                }
                <IconButton onClick={switchToRow}><TableOutlined style={{fontSize: '0.90rem', color: 'inherit'}}/></IconButton>
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
                type="source"
                position={Position.Bottom}
                isConnectable={false}
            />
        </>
    )
})

