import { createBrowserRouter } from 'react-router';
import RootLayout from '../layouts/RootLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Register from '../pages/Auth/Register';
import Login from '../pages/Auth/Login';
import Home from '../pages/Home/Home';
import AllProducts from '../pages/Products/AllProducts';
import ProductDetails from '../pages/Products/ProductDetails';
import BookingForm from '../pages/Products/BookingForm';
import MyOrders from '../pages/Dashboard/Buyer/MyOrders';
import PrivateRoute from './PrivateRoute';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'all-products', element: <AllProducts /> },
            { path: 'product/:id', element: <ProductDetails /> },
            { path: 'book-product/:id', element: <PrivateRoute><BookingForm /></PrivateRoute> },
        ]
    },
    {
        path: '/',
        element: <AuthLayout />,
        children: [
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
        ]
    },
    {
        path: '/dashboard',
        element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
        children: [
            { index: true, element: <div className="p-10 text-center text-3xl font-bold italic text-base-content/20">Dashboard Home Stub</div> },
            { path: 'my-orders', element: <MyOrders /> },
        ]
    }
]);

export default router;
