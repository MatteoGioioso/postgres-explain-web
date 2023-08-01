import {QueryExplainerRepository} from "../datalayer/QueryExplainer.repository";
import {GetQueryPlanCustomRequest} from "../proto/query_explainer.pb";
import {Explained, IndexesStats, PlanRow, Stats} from "../../CoreModules/Plan/types";
import {PlanService} from "../../CoreModules/Plan/parser";

export interface QueryPlanResponse {
    summary: PlanRow[]
    stats: Stats
    indexes_stats: IndexesStats
}

export class QueryExplainerService {
    private queryExplainerRepository: QueryExplainerRepository;
    private planService: PlanService

    constructor(queryExplainerRepository: QueryExplainerRepository) {
        this.queryExplainerRepository = queryExplainerRepository
        this.planService = new PlanService();
    }

    async getQueryPlanCustom(body: GetQueryPlanCustomRequest): Promise<Explained> {
        const response = await this.queryExplainerRepository.getQueryPlanCustom(body);
        const parsedResponse: QueryPlanResponse = JSON.parse(response.query_plan);
        return {
            indexes_stats: parsedResponse.indexes_stats,
            stats: parsedResponse.stats,
            summary: parsedResponse.summary,
        }
    }
}