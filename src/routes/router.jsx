import { createBrowserRouter } from 'react-router';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import Register from '../pages/Auth/Register';
import Login from '../pages/Auth/Login';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, element: <div className="p-10 text-center text-3xl font-bold">Welcome to StitchTrack</div> },
        ]
    },
    {
        path: '/',
        element: <AuthLayout />,
        children: [
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
        ]
    }
]);

export default router;
