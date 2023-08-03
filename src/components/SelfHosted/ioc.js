import {QueryExplainerRepository} from "./datalayer/QueryExplainer.repository";
import {getBackendOrigin} from "../../config";
import {QueryExplainerService} from "./services/QueryExplainer.service";
import {AnalyticsRepository} from "./datalayer/Analytics.repository";
import {AnalyticsService} from "./services/Analytics.service";

const queryExplainerRepository = new QueryExplainerRepository(getBackendOrigin());
const analyticsRepository = new AnalyticsRepository(getBackendOrigin());
export const queryExplainerService = new QueryExplainerService(queryExplainerRepository);
export const analyticsService = new AnalyticsService(analyticsRepository);