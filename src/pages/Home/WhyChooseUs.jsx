import { motion } from 'framer-motion';
import { FiShield, FiClock, FiTrendingUp, FiHeadphones, FiZap, FiGlobe } from 'react-icons/fi';

const features = [
    { icon: <FiShield />, title: 'Quality Assured', desc: 'Multi-stage quality checks at every production step' },
    { icon: <FiClock />, title: 'On-Time Delivery', desc: 'Real-time tracking ensures timely order completion' },
    { icon: <FiTrendingUp />, title: 'Production Analytics', desc: 'Data-driven insights to optimize your workflow' },
    { icon: <FiHeadphones />, title: '24/7 Support', desc: 'Dedicated support team for all your queries' },
    { icon: <FiZap />, title: 'Fast Processing', desc: 'Streamlined production pipeline for efficiency' },
    { icon: <FiGlobe />, title: 'Global Reach', desc: 'Ship to any location worldwide with full tracking' },
];

const WhyChooseUs = () => {
    return (
        <section className="py-20 bg-base-200">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="text-primary font-semibold text-sm uppercase tracking-widest">Why Us</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold mt-2 text-base-content">Why Choose StitchTrack?</h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="card bg-base-100 border border-base-300 p-6 hover:border-primary/50 hover:shadow-lg transition-all group"
                        >
                            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                <span className="text-2xl text-primary">{feature.icon}</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                            <p className="text-base-content/60 text-sm">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
