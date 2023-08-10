import {PlanService} from "../CoreModules/Plan/parser";
import {QueryExplainerService} from "./QueryExplainer.service";

// eslint-disable-next-line
const go = new Go()
export const planService = new PlanService();
export const queryExplainerService = new QueryExplainerService(planService)
export const waitWebAssembly = async () => {
    const res = await WebAssembly.instantiateStreaming(fetch('/main.wasm'), go.importObject)
    go.run(res.instance)
    console.log("wasm imported")
}