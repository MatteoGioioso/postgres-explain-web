import ThemeCustomization from './themes';
import Router from "./Router";
import {AppFunctionalityProvider} from "./MainContext";
import {ReactFlowProvider} from "reactflow";
import {NodeProvider, TableTabsProvider} from "./components/CoreModules/Plan/Contexts";
import "highlight.js/styles/default.css"

function App() {
    return (
        <ThemeCustomization>
            <ReactFlowProvider>
                    <TableTabsProvider>
                        <NodeProvider>
                            <AppFunctionalityProvider>
                                <Router/>
                            </AppFunctionalityProvider>
                        </NodeProvider>
                    </TableTabsProvider>
            </ReactFlowProvider>
        </ThemeCustomization>
    );
}

export default App;
