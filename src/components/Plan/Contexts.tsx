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
    setFocusedNodeId: value => {},
    setHoverNodeId: value => {}
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