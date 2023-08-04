import {QueryExplainerRepository} from "./datalayer/QueryExplainer.repository";
import {getBackendOrigin} from "../../config";
import {QueryExplainerService} from "./services/QueryExplainer.service";
import {AnalyticsRepository} from "./datalayer/Analytics.repository";
import {AnalyticsService} from "./services/Analytics.service";
import {InfoRepository} from "./datalayer/Info.repository";
import {InfoService} from "./services/Info.service";

const queryExplainerRepository = new QueryExplainerRepository(getBackendOrigin());
const analyticsRepository = new AnalyticsRepository(getBackendOrigin());
const infoRepository = new InfoRepository(getBackendOrigin());
export const queryExplainerService = new QueryExplainerService(queryExplainerRepository);
export const analyticsService = new AnalyticsService(analyticsRepository);
export const infoService = new InfoService(infoRepository);