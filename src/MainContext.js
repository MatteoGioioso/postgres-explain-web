import {createContext, useState} from "react";

export const PlanContext = createContext({});

export function PlanProvider(props) {
    const [plan, setPlan] = useState();

    return (
        <PlanContext.Provider value={{plan, setPlan}}>
            {props.children}
        </PlanContext.Provider>
    );
}

export const AppFunctionalityContext = createContext({})
export const AppFunctionalityProvider = (props) => {
    const appMode = window._env_.REACT_APP_MODE

    return (
        <AppFunctionalityContext.Provider value={{appMode}}>
            {props.children}
        </AppFunctionalityContext.Provider>
    )
}