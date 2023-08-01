import {lazy} from 'react';
import Loadable from './components/Loadable';
import MainLayout from './components/MainLayout';
import {useRoutes} from "react-router-dom";

import {getMode, LoadComponent, SELF_HOSTED, WEB} from "./config";

const componentsMap = {
    [SELF_HOSTED]: import('./components/SelfHosted/PlanVisualizationSelfHosted'),
    [WEB]: import('./components/Web/PlanVisualizationWeb')
}

const DashboardDefault = Loadable(lazy(() => import('./components/Dashboard')));
const PlanVisualizationLoadableWeb = Loadable(lazy(() => import('./components/Web/PlanVisualizationWeb')))
const PlanVisualizationLoadableSelfHosted = Loadable(lazy(() => import('./components/SelfHosted/PlanVisualizationSelfHosted')))
const ClustersTableLoadable = Loadable(lazy(() => import('./components/SelfHosted/ClustersTableAndQueryForm')));


// ==============================|| MAIN ROUTING ||============================== //

const WebRoutes = () => ({
    path: '/',
    element: <MainLayout/>,
    children: [
        {
            path: '/',
            element: <DashboardDefault/>
        },
        {
            path: '/plan',
            element: <PlanVisualizationLoadableWeb/>
        },
    ]
});

const SelfHostedRoutes = () => ({
    path: '/',
    element: <MainLayout/>,
    children: [
        {
            path: '/',
            element: <DashboardDefault/>
        },
        {
            path: '/clusters/:cluster_id',
            element: <ClustersTableLoadable/>
        },
        {
            path: '/clusters/:cluster_id/plans/:plan_id',
            element: <PlanVisualizationLoadableSelfHosted/>
        },
    ]
})

const routesMap = {
    [SELF_HOSTED]: SelfHostedRoutes,
    [WEB]: WebRoutes
}

const routesMapElement = routesMap[getMode()];

export default function Router() {
    return useRoutes([routesMapElement()]);
}

