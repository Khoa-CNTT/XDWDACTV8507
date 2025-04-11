import Cart from '../pages/Cart';
import Home from '../pages/Home';
import MainLayout from '../pages/MainLayout';

const routes = [
    {
        path: '/home',
        element: (
            <MainLayout>
                <Home />
            </MainLayout>
        ),
        private: false,
    },
    {
        path: '/cart',
        element: (
            <MainLayout>
                <Cart />
            </MainLayout>
        ),
        private: true,
    },
];

export default routes;
