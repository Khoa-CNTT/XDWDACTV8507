import { createBrowserRouter } from 'react-router-dom';
import routes from './routes';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const router = createBrowserRouter(
    routes.map((route) => {
        if (route.private) {
            return {
                path: route.path,
                element: <PrivateRoute>{route.element}</PrivateRoute>,
            };
        }
        return {
            path: route.path,
            element: <PublicRoute>{route.element}</PublicRoute>,
        };
    })
);

export default router;