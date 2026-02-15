import useRole from '../../hooks/useRole';
import useAuth from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { motion } from 'framer-motion';
import { FiPackage, FiShoppingCart, FiUsers, FiTrendingUp } from 'react-icons/fi';

const DashboardHome = () => {
    const { user } = useAuth();
    const { role, status } = useRole();
    const isManagerPending = role === 'manager' && status === 'pending';

    const axiosSecure = useAxiosSecure();

    const { data: stats = {} } = useQuery({
        queryKey: ['dashboard-stats', role],
        queryFn: async () => {
            const res = {};
            if (role === 'admin') {
                const [users, products, orders] = await Promise.all([
                    axiosSecure.get('/users/stats'),
                    axiosSecure.get('/products/stats'),
                    axiosSecure.get('/orders/all')
                ]);
                res.users = users.data.total;
                res.products = products.data.total;
                res.orders = orders.data.length;
                
                // Calculate revenue from paid orders or all completed orders
                const allOrders = orders.data;
                const totalRevenue = allOrders
                    .filter(o => o.paymentStatus === 'paid')
                    .reduce((sum, order) => sum + order.totalPrice, 0);
                res.revenue = totalRevenue.toFixed(2);
            } else if (role === 'manager' && !isManagerPending) {
                const [products, allOrders] = await Promise.all([
                    axiosSecure.get('/products/manager/my-products'),
                    axiosSecure.get('/orders/manager/all')
                ]);
                res.products = products.data.length;
                res.orders = allOrders.data.length;
                
                // Revenue: Sum of paid orders
                const paidOrders = allOrders.data.filter(o => o.paymentStatus === 'paid');
                res.revenue = paidOrders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2);
                
                // Users: Count unique buyers from orders
                const uniqueBuyers = new Set(allOrders.data.map(o => o.userEmail));
                res.users = uniqueBuyers.size;

            } else if (role === 'buyer') {
                const { data } = await axiosSecure.get('/orders/my-orders');
                res.orders = data.length;
                // Active: pending, approved, processing
                res.active = data.filter(o => ['pending', 'approved', 'processing'].includes(o.status)).length;
                res.completed = data.filter(o => o.status === 'completed').length; 
                
                // Revenue (Total Spent): Sum of paid orders
                const paidOrders = data.filter(o => o.paymentStatus === 'paid');
                res.revenue = paidOrders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2);
            }
            return res;
        },
        enabled: !!role
    });

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    if (isManagerPending) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className="text-warning text-6xl mb-4">⚠️</div>
                    <h1 className="text-3xl font-bold mb-2">Account Pending Approval</h1>
                    <p className="text-base-content/70 max-w-md mx-auto">
                        Your manager account is pending approval. All dashboard data will be visible after an admin approves your account.
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-extrabold">
                    {greeting()}, <span className="text-primary">{user?.displayName || 'User'}</span> 👋
                </h1>
                <p className="text-base-content/60 mt-1">
                    Welcome to your <span className="capitalize font-semibold">{role}</span> dashboard
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {[
                    { icon: <FiPackage />, label: role === 'buyer' ? 'Active Orders' : 'Products', value: role === 'buyer' ? (stats.active || '0') : (stats.products || '0'), color: 'bg-blue-500/10 text-blue-500' },
                    { icon: <FiShoppingCart />, label: 'Orders', value: stats.orders || '0', color: 'bg-green-500/10 text-green-500' },
                    { icon: <FiUsers />, label: role === 'buyer' ? 'Orders Completed' : 'Users', value: role === 'buyer' ? (stats.completed || '0') : (stats.users || '—'), color: 'bg-purple-500/10 text-purple-500' },
                    { icon: <FiTrendingUp />, label: role === 'buyer' ? 'Total Spent' : 'Revenue', value: stats.revenue ? `$${stats.revenue}` : '—', color: 'bg-amber-500/10 text-amber-500' },
                ].map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card bg-base-100 border border-base-300 p-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                                <span className="text-2xl">{card.icon}</span>
                            </div>
                            <div>
                                <p className="text-sm text-base-content/60">{card.label}</p>
                                <p className="text-2xl font-bold">{card.value}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 card bg-base-100 border border-base-300 p-6">
                <h2 className="text-lg font-bold mb-4">Quick Tips</h2>
                <ul className="space-y-2 text-sm text-base-content/70">
                    {role === 'admin' && (
                        <>
                            <li>• Manage user roles and approvals from the <strong>Manage Users</strong> page</li>
                            <li>• View production analytics from the <strong>Analytics</strong> page</li>
                            <li>• Toggle featured products on the home page</li>
                        </>
                    )}
                    {role === 'manager' && (
                        <>
                            <li>• Add new garment products from the <strong>Add Product</strong> page</li>
                            <li>• Review and approve/reject pending orders</li>
                            <li>• Update production tracking timelines</li>
                        </>
                    )}
                    {role === 'buyer' && (
                        <>
                            <li>• Browse products and place orders from the <strong>Products</strong> page</li>
                            <li>• Track your order status from <strong>My Orders</strong></li>
                            <li>• View order tracking timeline for approved orders</li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default DashboardHome;
