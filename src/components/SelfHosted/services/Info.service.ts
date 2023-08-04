import {AnalyticsRepository} from "../datalayer/Analytics.repository";
import {GetQueriesListRequest, GetQueriesListResponse} from "../proto/analytics.pb";
import {InfoRepository} from "../datalayer/Info.repository";
import {GetClustersRequest, GetClustersResponse} from "../proto/info.pb";


export class InfoService {
    private infoRepository: InfoRepository;

    constructor(infoRepository: InfoRepository) {
        this.infoRepository = infoRepository
    }

    async getClustersList(body: GetClustersRequest): Promise<GetClustersResponse> {
        return await this.infoRepository.getClustersList(body)
    }
}