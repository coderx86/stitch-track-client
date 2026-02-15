import { Link } from 'react-router';
import { motion } from 'framer-motion';

const ErrorPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6"
            >
                <h1 className="text-9xl font-black text-primary">404</h1>
                <h2 className="text-3xl font-bold text-base-content">Page Not Found</h2>
                <p className="text-base-content/60 max-w-md mx-auto">
                    The page you are looking for doesn't exist or has been moved.
                </p>
                <Link to="/" className="btn btn-primary">← Back to Home</Link>
            </motion.div>
        </div>
    );
};

export default ErrorPage;
