import { motion } from 'framer-motion';
import { FiClipboard, FiScissors, FiCheckCircle, FiTruck } from 'react-icons/fi';

const steps = [
    { icon: <FiClipboard />, title: 'Place Order', desc: 'Browse products, choose your items, and place an order with your specifications.' },
    { icon: <FiScissors />, title: 'Production', desc: 'Our skilled teams handle cutting, sewing, and finishing with precision.' },
    { icon: <FiCheckCircle />, title: 'Quality Check', desc: 'Every garment passes rigorous quality control before packaging.' },
    { icon: <FiTruck />, title: 'Delivery', desc: 'Track your order in real-time from factory to your doorstep.' },
];

const HowItWorks = () => {
    return (
        <section className="py-20 bg-base-200">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-primary font-semibold text-sm uppercase tracking-widest">Process</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold mt-2 text-base-content">How It Works</h2>
                    <p className="text-base-content/60 mt-3 max-w-xl mx-auto">
                        From order to delivery — a seamless production journey.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            className="relative text-center group"
                        >
                            {/* Connector line */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/40 to-primary/10"></div>
                            )}

                            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-2xl mb-6 group-hover:bg-primary/20 transition-colors">
                                <span className="text-3xl text-primary">{step.icon}</span>
                                <span className="absolute -top-2 -right-2 w-7 h-7 bg-primary text-primary-content rounded-full text-sm font-bold flex items-center justify-center">
                                    {index + 1}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-base-content mb-2">{step.title}</h3>
                            <p className="text-base-content/60 text-sm leading-relaxed">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
