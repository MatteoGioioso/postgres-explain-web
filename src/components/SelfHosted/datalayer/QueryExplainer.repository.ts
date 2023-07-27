import {GetQueryPlanRequest, GetQueryPlanResponse, QueryExplainer} from "../proto/query_explainer.pb";

export class QueryExplainerRepository {
    private readonly HOST: string;

    constructor() {
        // @ts-ignore
        this.HOST = window._env_.REACT_APP_API_URL;
    }

    getQueryPlan = async (body: GetQueryPlanRequest): Promise<GetQueryPlanResponse> => QueryExplainer
        .GetQueryPlan(body, {pathPrefix: this.HOST});
}
