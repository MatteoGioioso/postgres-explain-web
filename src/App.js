// import Form from "./components/Form";
import ThemeCustomization from './themes';
import Router from "./Router";
import {PlanProvider} from "./MainContext";
import {ReactFlowProvider} from "reactflow";
import {NodeProvider, TableTabsProvider} from "./components/Plan/Contexts";

function App() {
    return (
        <ThemeCustomization>
            <ReactFlowProvider>
                <PlanProvider>
                    <TableTabsProvider>>
                        <NodeProvider>
                            <Router/>
                        </NodeProvider>
                    </TableTabsProvider>
                </PlanProvider>
            </ReactFlowProvider>
        </ThemeCustomization>
    );
}

export default App;
