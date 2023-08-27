import {QueryExplainerRepository} from "../datalayer/QueryExplainer.repository";
import {GetQueryPlanRequest, GetQueryPlansListRequest, SaveQueryPlanRequest} from "../proto/query_explainer.pb";
import {Explained, Triggers} from "../../CoreModules/Plan/types";
import {PlanService} from "../../CoreModules/Plan/parser";
import {QueryPlan, QueryPlanListItem} from "../../CoreModules/types";

export class QueryExplainerService {
    private queryExplainerRepository: QueryExplainerRepository;
    private planService: PlanService

    constructor(queryExplainerRepository: QueryExplainerRepository) {
        this.queryExplainerRepository = queryExplainerRepository
        this.planService = new PlanService();
    }

    async saveQueryPlan(body: SaveQueryPlanRequest): Promise<string> {
        const response = await this.queryExplainerRepository.saveQueryPlan(body);
        return response.plan_id
    }

    async getQueryPlan(body: GetQueryPlanRequest): Promise<QueryPlan> {
        const response = await this.queryExplainerRepository.getQueryPlan(body)
        const parsedResponse: Explained = JSON.parse(response.query_plan);
        return {
            alias: "",
            id: response.plan_id,
            jit_stats: undefined,
            nodes_stats: undefined,
            period_start: undefined,
            query_id: response.query_id,
            tables_stats: undefined,
            triggers_stats: {} as Triggers,
            indexes_stats: parsedResponse.indexes_stats,
            stats: parsedResponse.stats,
            summary: parsedResponse.summary,
            original_plan: response.query_original_plan,
            query: response.query
        }
    }

    async getQueryPlansList(body: GetQueryPlansListRequest): Promise<QueryPlanListItem[]> {
        const response = await this.queryExplainerRepository.getQueryPlans({
            cluster_name: body.cluster_name,
        });

        if (response.plans?.length) {
            return response.plans.map(plan => ({
                id: plan.id,
                query: plan.query,
                period_start: new Date(plan.period_start as number)
            }))
        }

        return []
    }
}