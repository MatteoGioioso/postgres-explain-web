import {useLocation} from "react-router-dom";
import {useReactFlow} from "reactflow";
import {useContext, useEffect, useState} from "react";
import {NodeContext, TableTabsContext} from "./Contexts";

export const useFocus = (nodeId: string) => {
    const {focusedNodeId, setFocusedNodeId} = useContext(NodeContext);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [nodeIdFromHash, setNodeIdFromHash] = useState<string>();
    const {getNode, fitView} = useReactFlow();

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
        fitView({nodes: [node], duration: 800, maxZoom: 1.5})
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
        goToParentNode: (parendNodeId: string): void => {
            if (parendNodeId) {
                setFocusedNodeId(parendNodeId)
                const parentNode = getNode(parendNodeId);
                window.scrollTo(0, 0);
                fitView({nodes: [parentNode], duration: 800, maxZoom: 1.5})
            }
        },
        goUpRow: (): void => {
            const node = getNode(nodeId);
        },
        closeFocusNavigation: () => {
            setFocusedNodeId('')
            fitView({duration: 800})
        },
        switchToNode: (e) => {
            setFocusedNodeId(nodeId)
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
            const node = getNode(nodeId);
            fitView({nodes: [node], duration: 800, maxZoom: 1.5})
        },
        switchToRow: () => {
            setFocusedNodeId(nodeId)
            scrollToElement(nodeId)
        }
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