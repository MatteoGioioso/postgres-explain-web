import {createContext, Dispatch, SetStateAction, useState} from "react";

interface NodeContextProps {
    focusedNodeId: string
    setFocusedNodeId: Dispatch<SetStateAction<string>>
}

export const NodeContext = createContext<NodeContextProps>({
    focusedNodeId: '',
    setFocusedNodeId: value => {}
});

export function NodeProvider(props) {
    const [focusedNodeId, setFocusedNodeId] = useState('');

    return (
        <NodeContext.Provider value={{focusedNodeId, setFocusedNodeId}}>
            {props.children}
        </NodeContext.Provider>
    )
}
