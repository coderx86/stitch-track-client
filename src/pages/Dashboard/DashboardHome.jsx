import useRole from '../../hooks/useRole';
import useAuth from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { motion } from 'framer-motion';
import { FiPackage, FiShoppingCart, FiUsers, FiTrendingUp } from 'react-icons/fi';
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { RiProgress5Line } from "react-icons/ri";

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
                    .filter(o => o.paymentStatus === 'paid' || o.status === 'completed')
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
                const paidOrders = allOrders.data.filter(o => o.paymentStatus === 'paid' || o.status === 'completed');
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
        <div className="pb-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-primary/10 via-base-100 to-base-100 p-8 rounded-3xl border border-primary/20 shadow-sm relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-base-content tracking-tight">
                        {greeting()}, <span className="text-primary inline-block">{user?.displayName || 'User'}</span> <span className="inline-block hover:animate-bounce cursor-default">👋</span>
                    </h1>
                    <p className="text-base-content/70 mt-3 text-lg max-w-2xl">
                        Welcome to your <span className="capitalize font-semibold text-primary">{role}</span> dashboard. Here's what's happening today.
                    </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {[
                    { icon: role === 'buyer' ? <RiProgress5Line /> : <FiPackage />, label: role === 'buyer' ? 'Active Orders' : 'Products', value: role === 'buyer' ? (stats.active || '0') : (stats.products || '0'), color: 'bg-blue-500/10 text-blue-500' },
                    { icon: <FiShoppingCart />, label: 'Total Orders', value: stats.orders || '0', color: 'bg-green-500/10 text-green-500' },
                    { icon: role === 'buyer' ? <IoCheckmarkDoneSharp /> : <FiUsers />, label: role === 'buyer' ? 'Orders Completed' : 'Users', value: role === 'buyer' ? (stats.completed || '0') : (stats.users || '—'), color: 'bg-purple-500/10 text-purple-500' },
                    { icon: <FiTrendingUp />, label: role === 'buyer' ? 'Total Spent' : 'Revenue', value: stats.revenue ? `$${stats.revenue}` : '—', color: 'bg-amber-500/10 text-amber-500' },
                ].map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300 border border-base-300 relative overflow-hidden group p-6"
                    >
                        <div className={`absolute -top-4 -right-4 w-24 h-24 opacity-5 rounded-bl-[4rem] transition-transform duration-500 group-hover:scale-125 bg-current ${card.color.split(' ')[1]}`}></div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${card.color}`}>
                                <span className="text-2xl">{card.icon}</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-base-content/60 mb-1">{card.label}</p>
                                <p className="text-3xl font-bold tracking-tight text-base-content group-hover:text-primary transition-colors">{card.value}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 card bg-base-100 shadow-sm border border-base-300 overflow-hidden">
                <div className="bg-base-200/50 px-6 py-4 border-b border-base-300">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <span className="text-primary text-xl">💡</span> Quick Tips
                    </h2>
                </div>
                <div className="p-6">
                    <ul className="space-y-3 text-sm md:text-base text-base-content/70">
                        {role === 'admin' && (
                            <>
                                <li className="flex items-start gap-2"><span className="text-primary mt-1 font-bold">•</span> <span>Manage user roles and approvals from the <strong className="text-base-content">Manage Users</strong> page.</span></li>
                                <li className="flex items-start gap-2"><span className="text-primary mt-1 font-bold">•</span> <span>View production analytics from the <strong className="text-base-content">Analytics</strong> page.</span></li>
                                <li className="flex items-start gap-2"><span className="text-primary mt-1 font-bold">•</span> <span>Toggle featured products on the home page to highlight items.</span></li>
                            </>
                        )}
                        {role === 'manager' && (
                            <>
                                <li className="flex items-start gap-2"><span className="text-primary mt-1 font-bold">•</span> <span>Add new garment products from the <strong className="text-base-content">Add Product</strong> page.</span></li>
                                <li className="flex items-start gap-2"><span className="text-primary mt-1 font-bold">•</span> <span>Review and approve or reject pending orders efficiently.</span></li>
                                <li className="flex items-start gap-2"><span className="text-primary mt-1 font-bold">•</span> <span>Update production tracking timelines to keep buyers informed.</span></li>
                            </>
                        )}
                        {role === 'buyer' && (
                            <>
                                <li className="flex items-start gap-2"><span className="text-primary mt-1 font-bold">•</span> <span>Browse products and place orders from the <strong className="text-base-content">Products</strong> page.</span></li>
                                <li className="flex items-start gap-2"><span className="text-primary mt-1 font-bold">•</span> <span>Track your order status and history from <strong className="text-base-content">My Orders</strong>.</span></li>
                                <li className="flex items-start gap-2"><span className="text-primary mt-1 font-bold">•</span> <span>View detailed order tracking timelines for approved orders.</span></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
