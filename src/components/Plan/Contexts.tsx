import {createContext, Dispatch, SetStateAction, useState} from "react";

interface NodeContextProps {
    focusedNodeId: string
    hoverNodeId: string
    setFocusedNodeId: Dispatch<SetStateAction<string>>
    setHoverNodeId: Dispatch<SetStateAction<string>>
}

export const NodeContext = createContext<NodeContextProps>({
    focusedNodeId: '',
    hoverNodeId: '',
    setFocusedNodeId: value => {
    },
    setHoverNodeId: value => {
    }
});

export function NodeProvider(props) {
    const [focusedNodeId, setFocusedNodeId] = useState('');
    const [hoverNodeId, setHoverNodeId] = useState('')

    return (
        <NodeContext.Provider value={{focusedNodeId, setFocusedNodeId, hoverNodeId, setHoverNodeId}}>
            {props.children}
        </NodeContext.Provider>
    )
}

interface TableTabsProps {
    tabIndex: number
    setTabIndex: Dispatch<SetStateAction<number>>
}

export const TableTabsContext = createContext<TableTabsProps>({
    tabIndex: 0,
    setTabIndex: value => {}
})

export function TableTabsProvider(props) {
    const [tabIndex, setTabIndex] = useState(0);

    return (
        <TableTabsContext.Provider value={{tabIndex, setTabIndex}}>
            {props.children}
        </TableTabsContext.Provider>
    )
}