import {lazy} from 'react';
import Loadable from './components/Loadable';
import MainLayout from './components/MainLayout';
import {useRoutes} from "react-router-dom";

import {getMode, SELF_HOSTED, WEB} from "./config";
import HeaderContent from "./components/MainLayout/Header/HeaderContent";
import HeaderContentSelfHosted from "./components/MainLayout/Header/HeaderContent/HeaderContentSelfHosted";


const DashboardDefault = Loadable(lazy(() => import('./components/Dashboard')));
const PlanVisualizationLoadableWeb = Loadable(lazy(() => import('./components/Web/PlanVisualizationWeb')))
const PlanVisualizationLoadableSelfHosted = Loadable(lazy(() => import('./components/SelfHosted/PlanVisualizationSelfHosted')))
const ClustersTableLoadable = Loadable(lazy(() => import('./components/SelfHosted/ClustersTableAndQueryForm')));
const ClustersListLoadable = Loadable(lazy(() => import('./components/SelfHosted/ClustersList')))
// const PlanVisualizationComparisonWeb = Loadable(lazy(() => import('./components/Web/PlanVisualizationComparisonWeb')))


const WebRoutes = () => ({
    path: '/',
    element: (
        <MainLayout headerContent={<HeaderContent/>}/>
    ),
    children: [
        {
            path: '/',
            element: <DashboardDefault/>
        },
        {
            path: '/plan/:plan_id',
            element: <PlanVisualizationLoadableWeb/>
        },
        // {
        //     path: '/comparison',
        //     element: <PlanVisualizationComparisonWeb/>
        // }
    ]
});

const SelfHostedRoutes = () => ({
    path: '/',
    element: <MainLayout headerContent={<HeaderContentSelfHosted/>}/>,
    children: [
        {
            path: '/',
            element: <ClustersListLoadable/>
        },
        {
            path: '/clusters',
            element: <ClustersListLoadable/>
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

