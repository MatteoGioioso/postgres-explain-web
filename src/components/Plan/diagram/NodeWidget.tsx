import React, {memo} from 'react'
import {Handle, NodeToolbar, Position} from 'reactflow'
import {PlanRow} from '../types'
import Node from "./Node";
import {useTheme} from "@mui/material/styles";
import {IconButton} from "@mui/material";
import {CloseOutlined, DownOutlined, TableOutlined} from "@ant-design/icons";
import {useFocus} from "../hooks";

export interface NodeWidgetProps {
    data: PlanRow
}

export const NodeWidget = memo(({data}: NodeWidgetProps) => {
    const theme = useTheme()
    const {goToParentNode, closeFocusNavigation, isFocused, switchToRow} = useFocus(data.node_id);

    return (
        <>
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={false}
                style={{backgroundColor: 'transparent', color: 'transparent'}}
            />
            <NodeToolbar isVisible={isFocused} position={Position.Right}>
                {data.node_parent_id && (
                    <IconButton onClick={() => goToParentNode(data.node_parent_id)}>
                        <DownOutlined style={{fontSize: '0.90rem', color: 'inherit'}}/>
                    </IconButton>)
                }
                <IconButton onClick={switchToRow}><TableOutlined style={{fontSize: '0.90rem', color: 'inherit'}}/></IconButton>
                <IconButton onClick={(e) => closeFocusNavigation(e, true)}>
                    <CloseOutlined style={{fontSize: '0.90rem', color: 'inherit'}}/>
                </IconButton>
            </NodeToolbar>
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

