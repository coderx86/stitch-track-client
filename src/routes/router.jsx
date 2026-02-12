import { createBrowserRouter } from 'react-router';
import MainLayout from '../layouts/MainLayout';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, element: <div className="p-10 text-center text-3xl font-bold">Welcome to StitchTrack</div> },
        ]
    }
]);

export default router;
