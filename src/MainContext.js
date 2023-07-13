import {createContext, useState} from "react";

export const PlanContext = createContext({});

export function PlanProvider(props) {
    const [plan, setPlan] = useState("");

    return (
        <PlanContext.Provider value={{plan, setPlan}}>
            {props.children}
        </PlanContext.Provider>
    );
}