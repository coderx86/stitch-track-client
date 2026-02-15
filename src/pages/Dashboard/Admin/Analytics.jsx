import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { FiUsers, FiPackage, FiShoppingCart, FiTrendingUp } from 'react-icons/fi';

const COLORS = ['#f59e0b', '#6366f1', '#22c55e', '#ef4444', '#3b82f6'];

const Analytics = () => {
    const axiosSecure = useAxiosSecure();

    const { data: userStats } = useQuery({ queryKey: ['user-stats'], queryFn: async () => (await axiosSecure.get('/users/stats')).data });
    const { data: productStats } = useQuery({ queryKey: ['product-stats'], queryFn: async () => (await axiosSecure.get('/products/stats')).data });
    const { data: orderStats } = useQuery({ queryKey: ['order-stats'], queryFn: async () => (await axiosSecure.get('/orders/stats')).data });

    const orderBarData = [
        { name: 'Pending', v: orderStats?.pending || 0 },
        { name: 'Approved', v: orderStats?.approved || 0 },
        { name: 'Completed', v: orderStats?.completed || 0 },
        { name: 'Rejected', v: orderStats?.rejected || 0 }
    ];

    const userPieData = [
        { name: 'Buyers', v: userStats?.buyers || 0 },
        { name: 'Managers', v: userStats?.managers || 0 },
        { name: 'Admins', v: userStats?.admins || 0 }
    ];

    return (
        <div>
            <h1 className="text-2xl font-extrabold mb-8">System Analytics</h1>
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="card bg-base-100 border border-base-300 p-6">
                    <h3 className="font-bold mb-6 flex items-center gap-2"><FiShoppingCart className="text-primary" /> Order Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={orderBarData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <Bar dataKey="v" radius={[4, 4, 0, 0]}>{orderBarData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="card bg-base-100 border border-base-300 p-6">
                    <h3 className="font-bold mb-6 flex items-center gap-2"><FiUsers className="text-primary" /> User Roles</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={userPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="v">
                                {userPieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip /><Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
