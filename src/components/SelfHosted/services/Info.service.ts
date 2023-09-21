import {InfoRepository} from "../datalayer/Info.repository";
import {GetClusterInstancesRequest, GetClusterInstancesResponse, GetClustersRequest, GetClustersResponse, Instance} from "../proto/info.pb";
import {GetOptimizationsListRequest} from "../proto/query_explainer.pb";


export class InfoService {
    private infoRepository: InfoRepository;

    constructor(infoRepository: InfoRepository) {
        this.infoRepository = infoRepository
    }

    async getClustersList(body: GetClustersRequest): Promise<GetClustersResponse> {
        return await this.infoRepository.getClustersList(body)
    }

    async getClusterInstancesList(body: GetClusterInstancesRequest): Promise<Instance[]> {
        const clusterInstancesResponse = await this.infoRepository.getClusterInstancesList(body);
        return clusterInstancesResponse.instances
    }
}