import {GetClustersRequest, GetClustersResponse, Info} from "../proto/info.pb";

export class InfoRepository {
    private readonly ORIGIN: string;

    constructor(origin: string) {
        this.ORIGIN = origin
    }

    getClustersList = async (body: GetClustersRequest): Promise<GetClustersResponse> => Info
        .GetClusters(body, {pathPrefix: this.ORIGIN});

}
