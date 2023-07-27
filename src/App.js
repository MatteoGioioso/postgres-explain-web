// import Form from "./components/Form";
import ThemeCustomization from './themes';
import Router from "./Router";
import {AppFunctionalityProvider, PlanProvider} from "./MainContext";
import {ReactFlowProvider} from "reactflow";
import {NodeProvider, TableTabsProvider} from "./components/CoreModules/Plan/Contexts";

function App() {
    return (
        <ThemeCustomization>
            <ReactFlowProvider>
                <PlanProvider>
                    <TableTabsProvider>
                        <NodeProvider>
                            <AppFunctionalityProvider>
                                <Router/>
                            </AppFunctionalityProvider>
                        </NodeProvider>
                    </TableTabsProvider>
                </PlanProvider>
            </ReactFlowProvider>
        </ThemeCustomization>
    );
}

export default App;
