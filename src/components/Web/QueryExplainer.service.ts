import {nanoid} from "nanoid";
import store, {StoreType} from "store2";
import {PlanService} from "../CoreModules/Plan/parser";
import {Explained, PlanRow} from "../CoreModules/Plan/types";
import {NodeData} from "../CoreModules/Plan/Contexts";
import {QueryPlan, QueryPlanListItem} from "../CoreModules/types";
import {ErrorReport} from "../ErrorReporting";

interface SaveQueryPlanBody {
    plan: string
    query: string
    alias: string
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
        const out = global.explain(plan)

        if (out.error) {
            console.error(`${out.error}: ${out.error_details}`)
            throw new Error(JSON.stringify({
                message: out.error,
                error_details: out.error_details,
                stackTrace: out.error_stack,
            } as ErrorReport))
        } else {
            const id = nanoid(11)
            const parsedPlan: Explained = JSON.parse(out.explained)
            const planToSave: QueryPlan = {
                id,
                original_plan: plan,
                query: body.query || "",
                period_start: new Date(),
                alias: body.alias,
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
        const itemsObj: {[key: string]: QueryPlan} = this.plansStore.getAll();
        const items: QueryPlan[] = Object.values(itemsObj)
        items.sort((a, b) => {
            if (new Date(a.period_start) > new Date(b.period_start)) {
                return -1
            }

            return 1;
        })

        return items.map(plan => ({
            id: plan.id,
            query: plan.query,
            period_start: new Date(plan.period_start),
            alias: plan.alias,
        }))
    }

    deleteQueryPlanById(planId: string): void {
        this.plansStore.remove(planId)
    }
}