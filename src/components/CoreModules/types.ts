import {Explained} from "./Plan/types";

export interface QueryPlanListItem {
    query?: string;
    id?: string;
    period_start?: Date
    alias?: string
}

export interface QueryPlan extends Explained {
    original_plan?: string;
    query?: string;
    query_id?: string;
    id?: string;
    period_start?: Date
    alias?: string
}