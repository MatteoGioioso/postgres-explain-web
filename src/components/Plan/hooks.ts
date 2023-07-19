import {useLocation} from "react-router-dom";
import {useReactFlow} from "reactflow";
import {useEffect, useState} from "react";

export const useFocus = (nodeId: string) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [nodeIdFromHash, setNodeIdFromHash] = useState<string>();
    const location = useLocation();
    const {getNode, fitView} = useReactFlow();

    useEffect(() => {
        const nodeIdFH = (location.hash || "").replace("#", "")
        setNodeIdFromHash(nodeIdFH)

        if (nodeIdFH == nodeId) {
            setIsFocused(true)
        } else {
            setIsFocused(false)
        }
    }, [location.hash])

    const focusInternal = (isNode: boolean) => {
        window.location.hash = nodeId
        if (isNode) {
            window.scrollTo(0, 0);
        }
        const node = getNode(nodeId);
        fitView({nodes: [node], duration: 800, maxZoom: 1.5})
    }

    return {
        isFocused,
        focus: (isNode: boolean): void => {
            focusInternal(isNode)
        },
        isUnfocused: (): boolean => {
            if (location.hash !== "#" && location.hash !== "") {
                return nodeIdFromHash !== nodeId
            } else {
                return false
            }
        },
        goToParentNode: (parendNodeId: string): void => {
            if (parendNodeId) {
                const parentNode = getNode(parendNodeId);
                window.location.hash = parendNodeId
                window.scrollTo(0, 0);
                fitView({nodes: [parentNode], duration: 800, maxZoom: 1.5})
            }
        },
        goUpRow: (): void => {
            const node = getNode(nodeId);
        },
        closeFocusNavigation: (event, isNode: boolean) => {
            const element = document.getElementById(nodeId);
            window.location.hash = "";

            if (element && !isNode) {
                element.scrollIntoView();
                event.preventDefault();
            }
            fitView({duration: 800})
        },
        switchToNode: (e) => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
            const node = getNode(nodeId);
            fitView({nodes: [node], duration: 800, maxZoom: 1.5})
        },
        switchToRow: (e) => {
            const element = document.getElementById(nodeId);

            if (element) {
                element.scrollIntoView({behavior: 'smooth'});
            }
        }
    }
}