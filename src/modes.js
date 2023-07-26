import {lazy} from "react";

export const SELF_HOSTED = "self_hosted"
export const NORMAL = "normal"

const mode = window._env_.REACT_APP_MODE

export function LoadComponent(componentsMap) {
    return componentsMap[mode]
}