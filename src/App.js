// import Form from "./components/Form";
import ThemeCustomization from './themes';
import Router from "./Router";
import {PlanProvider} from "./MainContext";
import {ReactFlowProvider} from "reactflow";
import {NodeProvider} from "./components/Plan/Contexts";

function App() {
    return (
        <ThemeCustomization>
            <ReactFlowProvider>
                <PlanProvider>
                    <NodeProvider>
                        <Router/>
                    </NodeProvider>
                </PlanProvider>
            </ReactFlowProvider>
        </ThemeCustomization>
    );
}

export default App;
