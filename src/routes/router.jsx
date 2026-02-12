import { createBrowserRouter } from 'react-router';

const router = createBrowserRouter([
    {
        path: '/',
        element: <div>Main Layout Stub</div>,
        children: [
            { index: true, element: <div>Home Stub</div> },
        ]
    }
]);

export default router;
