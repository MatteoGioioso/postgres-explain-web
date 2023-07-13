// import Form from "./components/Form";
import ThemeCustomization from './themes';
import Router from "./Router";
import {PlanProvider} from "./MainContext";

function App() {
    return (
        <ThemeCustomization>
            <PlanProvider>
                <Router/>
            </PlanProvider>
        </ThemeCustomization>
    );
}

export default App;
