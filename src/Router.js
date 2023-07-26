import {lazy} from 'react';
import Loadable from './components/Loadable';
import MainLayout from './components/MainLayout';
import {useRoutes} from "react-router-dom";
import {SELF_HOSTED, NORMAL, LoadComponent} from "./modes"

const componentsMap = {
    [SELF_HOSTED]: import('./components/SelfHosted/PlanVisualizationSelfHosted'),
    [NORMAL]: import('./components/Web/PlanVisualizationWeb')
}

const DashboardDefault = Loadable(lazy(() => import('./components/Dashboard')));
const PlanVisualizationLoadable = Loadable(lazy(() => {
    return LoadComponent(componentsMap)
}))


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout/>,
    children: [
        {
            path: '/',
            element: <DashboardDefault/>
        },
        {
            path: '/plan',
            element: <PlanVisualizationLoadable/>
        },
    ]
};

export default function Router() {
    return useRoutes([MainRoutes]);
}

