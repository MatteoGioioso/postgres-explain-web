export const SELF_HOSTED = "self_hosted"
export const WEB = "web"

const mode = window._env_.REACT_APP_MODE

export function LoadComponent(componentsMap) {
    return componentsMap[mode]
}