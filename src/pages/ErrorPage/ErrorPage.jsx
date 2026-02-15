import { Link } from 'react-router';
import { motion } from 'framer-motion';

const ErrorPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-8 max-w-lg">
                <div className="relative inline-block"><h1 className="text-[12rem] font-black leading-none text-primary/10">404</h1><div className="absolute inset-0 flex items-center justify-center"><h2 className="text-5xl font-black text-primary">Oops!</h2></div></div>
                <div className="space-y-3"><h2 className="text-3xl font-bold text-base-content">Page Not Found</h2><p className="text-base-content/60 leading-relaxed italic">"It looks like this stitch has come lose. The page you are looking for has been moved or never existed."</p></div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4"><Link to="/" className="btn btn-primary btn-lg rounded-2xl px-10 shadow-xl shadow-primary/20">Return Home</Link><button onClick={() => window.history.back()} className="btn btn-outline btn-lg rounded-2xl px-10">Go Back</button></div>
            </motion.div>
        </div>
    );
};

export default ErrorPage;
