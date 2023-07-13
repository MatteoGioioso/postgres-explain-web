import {lazy} from 'react';

// project import
import Loadable from './components/Loadable';
import MainLayout from './components/MainLayout';
import {useRoutes} from "react-router-dom";

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('./components/Dashboard')));
const PlanLoadable = Loadable(lazy(() => import('./components/Plan')));


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
            element: <PlanLoadable/>
        },
    ]
};

export default function Router() {
    return useRoutes([MainRoutes]);
}

