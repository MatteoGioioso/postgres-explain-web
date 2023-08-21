import {nanoid} from "nanoid";
import store, {StoreType} from "store2";
import {PlanService} from "../CoreModules/Plan/parser";
import {Comparison, ComparisonResponse, Explained, ExplainedError, ExplainedResponse, PlanRow} from "../CoreModules/Plan/types";
import {NodeData} from "../CoreModules/Plan/Contexts";
import {QueryPlan, QueryPlanListItem} from "../CoreModules/types";
import {ErrorReport} from "../ErrorReporting";
import {waitWebAssembly} from "./ioc";

interface SaveQueryPlanBody {
    plan: string
    query: string
    alias: string
    optimization_id?: string
}

export interface ComparePlanResponse {
    comparison: Comparison;
    plan: QueryPlan;
    planToCompare: QueryPlan;
}

export class QueryExplainerService {
    private planService: PlanService;
    private plansStore: StoreType;

    constructor(planService: PlanService) {
        this.planService = planService
        this.plansStore = store.namespace('pgExplain-plans');
    }

    async saveQueryPlan(body: SaveQueryPlanBody): Promise<string> {
        const plan = this.planService.fromSource(body.plan);
        // @ts-ignore
        const out: ExplainedResponse = global.explain(plan)

        if (out.error) {
            throw new Error(out.error)
        } else {
            const id = nanoid(11)
            const parsedPlan: Explained = JSON.parse(out.explained)
            const planToSave: QueryPlan = {
                id,
                original_plan: plan,
                query: body.query || "",
                period_start: new Date(),
                alias: body.alias,
                optimization_id: body.optimization_id || id,
                ...parsedPlan
            }
            this.plansStore.set(id, planToSave)
            return id;
        }
    }

    getQueryPlan(id: string): QueryPlan {
        return this.plansStore.get(id)
    }

    getQueryPlanNode(planId: string, nodeId: string): NodeData {
        const response: QueryPlan = this.plansStore.get(planId);
        const foundNode: PlanRow = response.summary.find(node => node.node_id === nodeId);
        return {
            row: foundNode,
            stats: response.stats
        }
    }

    getQueryPlansList(): QueryPlanListItem[] {
        const itemsObj: { [key: string]: QueryPlan } = this.plansStore.getAll();
        return Object
            .values(itemsObj)
            .sort((a, b) => {
                if (new Date(a.period_start) > new Date(b.period_start)) {
                    return -1
                }

                return 1;
            })
            .map(plan => ({
                id: plan.id,
                query: plan.query,
                period_start: new Date(plan.period_start),
                alias: plan.alias,
            }))
    }

    getOptimizationsList(planId: string): QueryPlanListItem[] {
        const plan: QueryPlan = this.plansStore.get(planId);
        const all: { [key: string]: QueryPlan } = this.plansStore.getAll();
        return Object
            .values(all)
            .filter(item => item.optimization_id)
            .filter(item => item.optimization_id === plan.optimization_id)
            .sort((a, b) => {
                if (new Date(a.period_start) < new Date(b.period_start)) {
                    return -1
                }

                return 1;
            })
            .map(plan => ({
                id: plan.id,
                query: plan.query,
                period_start: new Date(plan.period_start),
                alias: plan.alias,
                executionTime: plan.stats.execution_time
            }))
    }

    async comparePlans(planId: string, planIdToCompare: string): Promise<ComparePlanResponse> {
        const plan: QueryPlan = this.plansStore.get(planId);
        const planToCompare: QueryPlan = this.plansStore.get(planIdToCompare);
        await waitWebAssembly()
        // @ts-ignore
        const out: ComparisonResponse = global.compare(JSON.stringify(plan), JSON.stringify(planToCompare))
        if (out.error) {
            throw new Error(out.error)
        } else {
            return {
                planToCompare, plan, comparison: JSON.parse(out.comparison)
            }
        }
    }

    uploadQueryPlan(plan: QueryPlan): void {
        this.plansStore.set(plan.id, plan)
    }

    deleteQueryPlanById(planId: string): void {
        this.plansStore.remove(planId)
    }
}