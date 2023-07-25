import {useReactFlow} from "reactflow";
import {useContext, useEffect, useState} from "react";
import {NodeContext, NodeData} from "./Contexts";

export const useFocus = (nodeId: string) => {
    const {focusedNodeId, setFocusedNodeId} = useContext(NodeContext);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [nodeIdFromHash, setNodeIdFromHash] = useState<string>();
    const {getNode, fitView, addNodes} = useReactFlow();

    useEffect(() => {
        setNodeIdFromHash(focusedNodeId)

        if (focusedNodeId == nodeId) {
            setIsFocused(true)
        } else {
            setIsFocused(false)
        }
    }, [focusedNodeId])

    const focusInternal = () => {
        setFocusedNodeId(nodeId)
        const node = getNode(nodeId);
        fitView({nodes: [node], duration: 800, maxZoom: 1.25})
    }

    const scrollToElement = (id: string): void => {
        const yOffset = -100;
        const element = document.getElementById(id);
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;

        window.scrollTo({top: y, behavior: 'smooth'});
    }

    return {
        isFocused,
        focus: (): void => {
            focusInternal()
        },
        isUnfocused: (): boolean => {
            if (nodeIdFromHash) {
                return nodeIdFromHash !== nodeId
            } else {
                return false
            }
        },
        closeFocusNavigation: () => {
            setFocusedNodeId('')
            fitView({duration: 800})
        },
        switchToNode: (nodeIdv?: string) => {
            setFocusedNodeId(nodeId)
            const node = getNode(nodeId);
            fitView({nodes: [node], duration: 800, maxZoom: 1.5})
        },
        switchToRow: () => {
            setFocusedNodeId(nodeId)
            scrollToElement(nodeId)
        },
        focusedNodeId
    }
}

export const useNodeHover = (nodeId: string) => {
    const {hoverNodeId, setHoverNodeId} = useContext(NodeContext);

    return {
        setHover: () => {
            setHoverNodeId(nodeId)
        },
        unsetHover: () => {
            setHoverNodeId('')
        },
        isHovered: (nodeId: string): boolean => {
            return nodeId === hoverNodeId
        }
    }
}

export const useNodeDataProvider = () => {
    const {nodeData, setNodeData, focusedNodeId, explained, setExplained} = useContext(NodeContext);

    useEffect(() => {
        if (explained && focusedNodeId) {
            const planRow = explained.summary.find(node => node.node_id === focusedNodeId);
            setNodeData({
                row: planRow,
                stats: explained.stats
            })
        }

        if (focusedNodeId === "") {
            setNodeData(null)
        }

    }, [explained, focusedNodeId])

    return {
        getNodeData: (): NodeData => {
            return nodeData
        },
    }
}