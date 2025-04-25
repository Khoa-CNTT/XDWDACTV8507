import Booking from '../pages/Booking';
import BookingHistory from '../pages/BookingHistory';
import Cart from '../pages/Cart';
import HaircutDetail from '../pages/HaircutDetail';
import Home from '../pages/Home';
import MainLayout from '../pages/MainLayout';
import PaymentReturn from '../pages/PaymentReturn';
import Profile from '../pages/Profile';

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
        path: '/detail/:categoryId',
        element: (
            <MainLayout>
                <HaircutDetail />
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
    {
        path: '/profile',
        element: (
            <MainLayout>
                <Profile />
            </MainLayout>
        ),
        private: true,
    },
    {
        path: '/booking',
        element: (
            <MainLayout>
                <Booking />
            </MainLayout>
        ),
        private: true,
    },
    {
        path: '/booking-history',
        element: (
            <MainLayout>
                <BookingHistory />
            </MainLayout>
        ),
        private: true,
    }
    ,
    {
        path: '/payment-return',
        element: (
            <PaymentReturn />
        ),
        private: true,
    }
];

export default routes;
