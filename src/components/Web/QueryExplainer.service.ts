import {nanoid} from "nanoid";
import store, {StoreType} from "store2";
import {PlanService} from "../CoreModules/Plan/parser";
import {QueryPlan} from "../SelfHosted/services/QueryExplainer.service";
import {PlanRow} from "../CoreModules/Plan/types";
import {NodeData} from "../CoreModules/Plan/Contexts";

export class QueryExplainerService {
    private planService: PlanService;
    private plansStore: StoreType;
    constructor(planService: PlanService) {
        this.planService = planService
        this.plansStore = store.namespace('pgExplain-plans');
    }

    async saveQueryPlan(body): Promise<string> {
        const plan = this.planService.fromSource(body.plan);
        // @ts-ignore
        const out = global.explain(plan)

        if (out.error) {
            console.error(`${out.error}: ${out.error_details}`)
            throw new Error(JSON.stringify({
                message: out.error,
                error_details: out.error_details,
                stackTrace: out.error_stack,
            }))
        } else {
            const id = nanoid(11)
            this.plansStore.set(id, {
                plan_id: id,
                query_plan: JSON.parse(out.explained),
                query_original_plan: plan,
                query: body.query || "",
                period_start: new Date(),
                alias: body.alias
            })
            return id;
        }
    }

    getQueryPlan(id: string): QueryPlan {
        return this.plansStore.get(id)
    }

    getQueryPlanNode(planId: string, nodeId: string): NodeData {
        const response = this.plansStore.get(planId);
        const foundNode = response.query_plan.summary.find(node => node.node_id === nodeId);
        return {
            row: foundNode,
            stats: response.query_plan.stats
        }
    }

    getQueryPlansList(): QueryPlan[] {
        const itemsObj = this.plansStore.getAll();
        const items = Object.values(itemsObj)
        items.sort((a, b) => {
            if (new Date(a.period_start) > new Date(b.period_start)) {
                return -1
            }

            return 1;
        })
        return items.map(plan => ({
            id: plan.plan_id,
            query: plan.query,
            period_start: new Date(plan.period_start),
            alias: plan.alias,
        }))
    }
}