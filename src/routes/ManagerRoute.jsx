import { Navigate } from 'react-router';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import Loading from '../components/Loading/Loading';

const ManagerRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const { role, status, roleLoading } = useRole();

    if (loading || roleLoading) {
        return <Loading />;
    }

    if (!user || role !== 'manager') {
        return <Navigate to="/" replace />;
    }

    if (role === 'manager' && status === 'pending') {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                <div className="text-warning text-6xl mb-4">⚠️</div>
                <h1 className="text-3xl font-bold mb-2">Account Pending Approval</h1>
                <p className="text-base-content/70 max-w-md mx-auto">
                    Your manager account is pending approval. You cannot access this page until an admin approves your account.
                </p>
            </div>
        );
    }

    return children;
};

export default ManagerRoute;
