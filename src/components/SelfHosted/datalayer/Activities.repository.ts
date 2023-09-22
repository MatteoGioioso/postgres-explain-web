import {
    GetProfileRequest, GetProfileResponse, Activities, GetTopQueriesRequest, GetTopQueriesResponse
} from "../proto/activities.pb";

export class ActivitiesRepository {
    private readonly ORIGIN: string;

    constructor(origin: string) {
        this.ORIGIN = origin
    }

    getProfile = async (body: GetProfileRequest): Promise<GetProfileResponse> => Activities
        .GetProfile(body, {pathPrefix: this.ORIGIN});

    getTopQueries = async (body: GetTopQueriesRequest): Promise<GetTopQueriesResponse> => Activities
        .GetTopQueries(body, {pathPrefix: this.ORIGIN});
}
