import {lazy} from 'react';
import Loadable from './components/Loadable';
import MainLayout from './components/MainLayout';
import {useRoutes} from "react-router-dom";
import {getMode, SELF_HOSTED, WEB} from "./config";
import HeaderContent from "./components/Web/HeaderContent";
import HeaderContentSelfHosted from "./components/SelfHosted/HeaderContent";

const HomePageLoadableWeb = Loadable(lazy(() => import('./components/Web/HomePage')));
const PlanVisualizationLoadableWeb = Loadable(lazy(() => import('./components/Web/PlanVisualizationWeb')))
const HelpLoadableWeb = Loadable(lazy(() => import('./components/Web/HelpWeb')))
const PlanVisualizationComparisonWeb = Loadable(lazy(() => import('./components/Web/PlanVisualizationComparisonWeb')))

const PlanVisualizationLoadableSelfHosted = Loadable(lazy(() => import('./components/SelfHosted/PlanVisualizationSelfHosted')))
const ClustersLoadableSelfHosted = Loadable(lazy(() => import('./components/SelfHosted/Cluster')));
const ClustersListLoadableSelfHosted = Loadable(lazy(() => import('./components/SelfHosted/ClustersList')))
const PlansLoadableSelfHosted = Loadable(lazy(() => import('./components/SelfHosted/Plans')))

const WebRoutes = () => ({
    path: '/',
    element: (
        <MainLayout headerContent={<HeaderContent/>}/>
    ),
    children: [
        {
            path: '/',
            element: <HomePageLoadableWeb/>
        },
        {
            path: '/plans/:plan_id',
            element: <PlanVisualizationLoadableWeb/>
        },
        {
            path: '/plans/:plan_id/comparisons/:plan_id_to_compare',
            element: <PlanVisualizationComparisonWeb/>
        },
        {
            path: '/docs',
            element: <HelpLoadableWeb/>
        }
    ]
});

const SelfHostedRoutes = () => ({
    path: '/',
    element: <MainLayout headerContent={<HeaderContentSelfHosted/>}/>,
    children: [
        {
            path: '/',
            element: <ClustersListLoadableSelfHosted/>
        },
        {
            path: '/clusters',
            element: <ClustersListLoadableSelfHosted/>
        },
        {
            path: '/clusters/:cluster_id',
            element: <ClustersLoadableSelfHosted/>
        },
        {
            path: '/clusters/:cluster_id/plans',
            element: <PlansLoadableSelfHosted />
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

