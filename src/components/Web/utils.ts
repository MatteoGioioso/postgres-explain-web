import React from "react";
import {queryExplainerService} from "./ioc";
import {QueryPlan} from "../CoreModules/types";

export const uploadSharablePlan = async (event: React.SyntheticEvent) => {
    // @ts-ignore
    const file = event.target.files[0];
    const jsonFile: QueryPlan = await new Response(file).json();
    if (!jsonFile.id) {
        throw new Error("Plan does not contain an ID")
    }

    if (!(/^[\w-]{11}$/.test(jsonFile.id))) {
        throw new Error("Plan does not contain a valid ID")
    }

    queryExplainerService.uploadQueryPlan(jsonFile)
    return jsonFile.id
}