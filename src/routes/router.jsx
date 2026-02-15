import { createBrowserRouter } from 'react-router';
import RootLayout from '../layouts/RootLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Register from '../pages/Auth/Register';
import Login from '../pages/Auth/Login';
import Home from '../pages/Home/Home';
import About from '../pages/About/About';
import Contact from '../pages/Contact/Contact';
import AllProducts from '../pages/Products/AllProducts';
import ProductDetails from '../pages/Products/ProductDetails';
import BookingForm from '../pages/Products/BookingForm';
import MyOrders from '../pages/Dashboard/Buyer/MyOrders';
import Profile from '../pages/Dashboard/Profile';
import DashboardHome from '../pages/Dashboard/DashboardHome';
import PaymentHistory from '../pages/Dashboard/Buyer/PaymentHistory';
import ManageUsers from '../pages/Dashboard/Admin/ManageUsers';
import AdminAllProducts from '../pages/Dashboard/Admin/AdminAllProducts';
import AdminAllOrders from '../pages/Dashboard/Admin/AdminAllOrders';
import Analytics from '../pages/Dashboard/Admin/Analytics';
import AddProduct from '../pages/Dashboard/Manager/AddProduct';
import ManageProducts from '../pages/Dashboard/Manager/ManageProducts';
import EditProduct from '../pages/Dashboard/Manager/EditProduct';
import PendingOrders from '../pages/Dashboard/Manager/PendingOrders';
import ApprovedOrders from '../pages/Dashboard/Manager/ApprovedOrders';
import OrderLog from '../pages/Dashboard/Manager/OrderLog';
import TrackOrder from '../pages/Dashboard/Shared/TrackOrder';
import PaymentPage from '../pages/Payment/PaymentPage';
import PaymentSuccess from '../pages/Payment/PaymentSuccess';
import PaymentFail from '../pages/Payment/PaymentFail';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import ManagerRoute from './ManagerRoute';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'all-products', element: <AllProducts /> },
            { path: 'about', element: <About /> },
            { path: 'contact', element: <Contact /> },
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
            { index: true, element: <DashboardHome /> },
            { path: 'profile', element: <Profile /> },
            { path: 'my-orders', element: <MyOrders /> },
            { path: 'payment-history', element: <PaymentHistory /> },
            { path: 'manage-users', element: <AdminRoute><ManageUsers /></AdminRoute> },
            { path: 'all-products', element: <AdminRoute><AdminAllProducts /></AdminRoute> },
            { path: 'all-orders', element: <AdminRoute><AdminAllOrders /></AdminRoute> },
            { path: 'analytics', element: <AdminRoute><Analytics /></AdminRoute> },
            { path: 'add-product', element: <ManagerRoute><AddProduct /></ManagerRoute> },
            { path: 'manage-products', element: <ManagerRoute><ManageProducts /></ManagerRoute> },
            { path: 'edit-product/:id', element: <ManagerRoute><EditProduct /></ManagerRoute> },
            { path: 'pending-orders', element: <ManagerRoute><PendingOrders /></ManagerRoute> },
            { path: 'approved-orders', element: <ManagerRoute><ApprovedOrders /></ManagerRoute> },
            { path: 'order-log', element: <ManagerRoute><OrderLog /></ManagerRoute> },
            { path: 'pay/:id', element: <PaymentPage /> },
            { path: 'payment-success', element: <PaymentSuccess /> },
            { path: 'payment-fail', element: <PaymentFail /> },
            { path: 'track-order/:id', element: <TrackOrder /> },
        ]
    }
]);

export default router;
