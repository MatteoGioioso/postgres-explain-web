import {PlanService} from "../CoreModules/Plan/parser";
import {QueryExplainerService} from "./QueryExplainer.service";

// @ts-ignore
const go = new Go()
export const planService = new PlanService();
export const queryExplainerService = new QueryExplainerService(planService)

let wasmInstance = null
export const waitWebAssembly = async () => {
    if (wasmInstance) return
    const res = await WebAssembly.instantiateStreaming(fetch('/main.wasm'), go.importObject)
    go.run(res.instance)
    wasmInstance = res.instance
    console.log("wasm imported")
}

waitWebAssembly().then().catch(console.error)