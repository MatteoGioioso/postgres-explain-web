import {PlanService} from "../CoreModules/Plan/parser";

// eslint-disable-next-line
const go = new Go()
const planService = new PlanService();
WebAssembly.instantiateStreaming(fetch('/main.wasm'), go.importObject).then(res => {
    go.run(res.instance)
    console.log("wasm imported")
})

export {
    go, planService
}