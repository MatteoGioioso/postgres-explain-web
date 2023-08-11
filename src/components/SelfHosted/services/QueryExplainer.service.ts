import {QueryExplainerRepository} from "../datalayer/QueryExplainer.repository";
import {GetQueryPlanRequest, GetQueryPlansListRequest, SaveQueryPlanRequest} from "../proto/query_explainer.pb";
import {Explained, IndexesStats, PlanRow, Stats} from "../../CoreModules/Plan/types";
import {PlanService} from "../../CoreModules/Plan/parser";

export interface QueryPlanResponse {
    summary: PlanRow[]
    stats: Stats
    indexes_stats: IndexesStats
}

export interface QueryPlan {
    summary?: PlanRow[];
    stats?: Stats;
    indexes_stats?: IndexesStats;
    original_plan?: string;
    query?: string;
    queryId?: string;
    id?: string;
    period_start?: Date
    alias?: string
}

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
        const parsedResponse: QueryPlanResponse = JSON.parse(response.query_plan);
        return {
            indexes_stats: parsedResponse.indexes_stats,
            stats: parsedResponse.stats,
            summary: parsedResponse.summary,
            original_plan: response.query_original_plan,
            query: response.query
        }
    }

    async getQueryPlansList(body: GetQueryPlansListRequest): Promise<QueryPlan[]> {
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