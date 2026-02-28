import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';
import { FiPackage, FiShoppingCart, FiUsers, FiTag } from 'react-icons/fi';
import CountUp from 'react-countup';

const StatCard = ({ icon, label, value, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="card bg-base-100 border border-base-300 p-8 text-center group hover:border-primary/30 transition-colors"
    >
        <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <p className="text-4xl font-extrabold text-base-content">
            {typeof value === 'number' ? <CountUp end={value} duration={2} separator="," /> : value}
            <span className="text-primary">+</span>
        </p>
        <p className="text-base-content/60 mt-2 font-medium">{label}</p>
    </motion.div>
);

const StatsSection = () => {
    const axiosPublic = useAxios();

    const { data: productStats = {} } = useQuery({
        queryKey: ['public-product-stats'],
        queryFn: async () => {
            // Use public products endpoint to estimate counts
            const { data } = await axiosPublic.get('/products?limit=1');
            return { total: data.total || 0 };
        }
    });

    const stats = [
        { icon: <FiPackage className="text-blue-500" />, label: 'Products Listed', value: productStats.total || 120, color: 'bg-blue-500/10', delay: 0 },
        { icon: <FiShoppingCart className="text-green-500" />, label: 'Orders Processed', value: 850, color: 'bg-green-500/10', delay: 0.1 },
        { icon: <FiUsers className="text-purple-500" />, label: 'Active Users', value: 430, color: 'bg-purple-500/10', delay: 0.2 },
        { icon: <FiTag className="text-amber-500" />, label: 'Product Categories', value: 24, color: 'bg-amber-500/10', delay: 0.3 },
    ];

    return (
        <section className="py-20 bg-base-100">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                    <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-3">Platform Stats</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold">Numbers That <span className="text-primary">Speak For Themselves</span></h2>
                    <p className="text-base-content/60 mt-3">Trusted by garment factories across Bangladesh</p>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((s, i) => <StatCard key={i} {...s} />)}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
