import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { FiUsers, FiPackage, FiShoppingCart, FiTrendingUp } from 'react-icons/fi';

const COLORS = ['#f59e0b', '#6366f1', '#22c55e', '#ef4444', '#3b82f6', '#10b981'];

const Analytics = () => {
    const axiosSecure = useAxiosSecure();

    const { data: userStats } = useQuery({
        queryKey: ['user-stats'],
        queryFn: async () => (await axiosSecure.get('/users/stats')).data
    });

    const { data: productStats } = useQuery({
        queryKey: ['product-stats'],
        queryFn: async () => (await axiosSecure.get('/products/stats')).data
    });

    const { data: orderStats } = useQuery({
        queryKey: ['order-stats'],
        queryFn: async () => (await axiosSecure.get('/orders/stats')).data
    });

    const statCards = [
        { icon: <FiUsers />, label: 'Total Users', value: userStats?.total || 0, color: 'text-blue-500 bg-blue-500/10' },
        { icon: <FiPackage />, label: 'Total Products', value: productStats?.total || 0, color: 'text-green-500 bg-green-500/10' },
        { icon: <FiShoppingCart />, label: 'Total Orders', value: orderStats?.total || 0, color: 'text-purple-500 bg-purple-500/10' },
        { icon: <FiTrendingUp />, label: 'New This Month', value: userStats?.newThisMonth || 0, color: 'text-amber-500 bg-amber-500/10' },
    ];

    const orderBarData = [
        { name: 'Pending', value: orderStats?.pending || 0 },
        { name: 'Approved', value: orderStats?.approved || 0 },
        { name: 'Completed', value: orderStats?.completed || 0 },
        { name: 'Rejected', value: orderStats?.rejected || 0 },
        { name: 'Cancelled', value: orderStats?.cancelled || 0 },
    ];

    const userPieData = [
        { name: 'Buyers', value: userStats?.buyers || 0 },
        { name: 'Managers', value: userStats?.managers || 0 },
        { name: 'Admins', value: userStats?.admins || 0 },
    ];

    return (
        <div>
            <h1 className="text-2xl font-extrabold mb-6">Analytics Dashboard</h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card bg-base-100 border border-base-300 p-5"
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

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Order Status Chart */}
                <div className="card bg-base-100 border border-base-300 p-6">
                    <h3 className="font-bold text-lg mb-4">Orders by Status</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={orderBarData}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                {orderBarData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* User Roles Chart */}
                <div className="card bg-base-100 border border-base-300 p-6">
                    <h3 className="font-bold text-lg mb-4">Users by Role</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={userPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                                {userPieData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
