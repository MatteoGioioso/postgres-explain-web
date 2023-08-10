import {waitWebAssembly} from "./ioc";
import {nanoid} from "nanoid";
import store from "store2";

export class QueryExplainerService {
    constructor(planService) {
        this.planService = planService
        this.plansStore = store.namespace('pgExplain-plans');
    }

    async saveQueryPlan(body) {
        await waitWebAssembly() // TODO might be not needed
        const plan = this.planService.fromSource(body.plan);
        const out = global.explain(plan)

        if (out.error) {
            console.error(`${out.error}: ${out.error_details}`)

            throw new Error(JSON.stringify(out.error))
        } else {
            const id = nanoid(11)
            this.plansStore.set(id, {
                plan_id: id,
                query_plan: JSON.parse(out.explained),
                query_original_plan: plan,
                query: body.query || "",
                period_start: new Date()
            })
            return id;
        }
    }

    getQueryPlan(id) {
        return this.plansStore.get(id)
    }

    getQueryPlansList() {
        const itemsObj = this.plansStore.getAll();
        const items = Object.values(itemsObj)
        return items.map(plan => ({
            id: plan.plan_id,
            query: plan.query,
            period_start: new Date(plan.period_start)
        }))
    }
}