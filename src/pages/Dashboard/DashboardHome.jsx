import useRole from '../../hooks/useRole';
import useAuth from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { motion } from 'framer-motion';
import { FiPackage, FiShoppingCart, FiUsers, FiTrendingUp } from 'react-icons/fi';

const DashboardHome = () => {
    const { user } = useAuth();
    const { role, status } = useRole();
    const axiosSecure = useAxiosSecure();

    const { data: stats = {} } = useQuery({
        queryKey: ['dashboard-stats', role],
        queryFn: async () => {
            const res = {};
            if (role === 'admin') {
                const [u, p, o] = await Promise.all([axiosSecure.get('/users/stats'), axiosSecure.get('/products/stats'), axiosSecure.get('/orders/all')]);
                res.users = u.data.total; res.products = p.data.total; res.orders = o.data.length;
                res.revenue = o.data.filter(x => x.paymentStatus === 'paid').reduce((s, x) => s + x.totalPrice, 0).toFixed(2);
            } else if (role === 'manager' && status !== 'pending') {
                const [p, o] = await Promise.all([axiosSecure.get('/products/manager/my-products'), axiosSecure.get('/orders/manager/all')]);
                res.products = p.data.length; res.orders = o.data.length;
                res.revenue = o.data.filter(x => x.paymentStatus === 'paid').reduce((s, x) => s + x.totalPrice, 0).toFixed(2);
                res.users = new Set(o.data.map(x => x.userEmail)).size;
            } else if (role === 'buyer') {
                const { data } = await axiosSecure.get('/orders/my-orders');
                res.orders = data.length; res.active = data.filter(x => ['pending', 'approved'].includes(x.status)).length; res.completed = data.filter(x => x.status === 'completed').length;
                res.revenue = data.filter(x => x.paymentStatus === 'paid').reduce((s, x) => s + x.totalPrice, 0).toFixed(2);
            }
            return res;
        },
        enabled: !!role
    });

    if (role === 'manager' && status === 'pending') return <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4"><h1 className="text-3xl font-bold mb-2">Account Pending Verification</h1><p className="max-w-md text-base-content/60">Your manager dashboard will be available once an admin verifies your account.</p></div>;

    return (
        <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-extrabold tracking-tight">Welcome, <span className="text-primary">{user?.displayName || 'User'}</span></h1>
                <p className="text-base-content/60 mt-1">Here is what is happening with your <span className="capitalize font-medium">{role}</span> dashboard today.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { icon: <FiPackage />, label: role === 'buyer' ? 'Active Orders' : 'Products', value: role === 'buyer' ? stats.active : stats.products, color: 'text-blue-500 bg-blue-500/10' },
                    { icon: <FiShoppingCart />, label: 'Orders', value: stats.orders, color: 'text-green-500 bg-green-500/10' },
                    { icon: <FiUsers />, label: role === 'buyer' ? 'Completed' : 'Users', value: role === 'buyer' ? stats.completed : stats.users, color: 'text-purple-500 bg-purple-500/10' },
                    { icon: <FiTrendingUp />, label: role === 'buyer' ? 'Total Spent' : 'Revenue', value: stats.revenue ? `$${stats.revenue}` : '—', color: 'text-amber-500 bg-amber-500/10' }
                ].map((c, i) => (
                    <div key={i} className="card bg-base-100 border border-base-300 p-6 flex-row items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${c.color}`}>{c.icon}</div>
                        <div><p className="text-xs font-semibold uppercase tracking-wider text-base-content/40">{c.label}</p><p className="text-2xl font-bold">{c.value || '0'}</p></div>
                    </div>
                ))}
            </div>
            <div className="card bg-base-100 border border-base-300 p-6"><h2 className="text-lg font-bold mb-4">Quick Links & Info</h2><ul className="text-sm text-base-content/70 space-y-2">
                {role === 'admin' && <li>• Manage users and roles from the sidebar.</li>}
                {role === 'manager' && <li>• Monitor production and update tracking info.</li>}
                {role === 'buyer' && <li>• Track your orders and complete payments safely.</li>}
            </ul></div>
        </div>
    );
};

export default DashboardHome;
