import {QueryExplainerRepository} from "./datalayer/QueryExplainer.repository";
import {getBackendOrigin} from "../../config";
import {QueryExplainerService} from "./services/QueryExplainer.service";

const queryExplainerRepository = new QueryExplainerRepository(getBackendOrigin());
export const queryExplainerService = new QueryExplainerService(queryExplainerRepository);