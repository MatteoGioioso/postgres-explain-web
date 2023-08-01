import {GetQueryPlanCustomRequest, GetQueryPlanRequest, GetQueryPlanResponse, QueryExplainer} from "../proto/query_explainer.pb";

export class QueryExplainerRepository {
    private readonly ORIGIN: string;

    constructor(origin: string) {
        this.ORIGIN = origin
    }

    getQueryPlan = async (body: GetQueryPlanRequest): Promise<GetQueryPlanResponse> => QueryExplainer
        .GetQueryPlan(body, {pathPrefix: this.ORIGIN});

    getQueryPlanCustom = async (body: GetQueryPlanCustomRequest): Promise<GetQueryPlanResponse> => QueryExplainer
        .GetQueryPlanCustom(body, {pathPrefix: this.ORIGIN});
}
