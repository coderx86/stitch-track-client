import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { GiSewingMachine } from 'react-icons/gi';

const HeroBanner = () => {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-base-200 via-base-100 to-base-200 min-h-[85vh] flex items-center">
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
                    animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full"
                        >
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                            <span className="text-primary text-sm font-medium">Garments Production Made Simple</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-base-content leading-tight"
                        >
                            Track Every
                            <span className="text-primary"> Stitch</span>,
                            <br />
                            Deliver On
                            <span className="text-primary"> Time</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg text-base-content/70 max-w-lg"
                        >
                            Streamline your garment factory workflow — from cutting to shipping. Manage orders, track production stages, and ensure quality delivery.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-wrap gap-4"
                        >
                            <Link to="/all-products" className="btn btn-primary btn-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                                View Products
                            </Link>
                            <Link to="/register" className="btn btn-outline btn-lg text-base-content border-base-content/30 hover:bg-base-content/10 hover:border-base-content/50">
                                Get Started
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex gap-8 pt-4"
                        >
                            {[
                                { num: '500+', label: 'Orders Delivered' },
                                { num: '50+', label: 'Active Managers' },
                                { num: '99%', label: 'On-Time Rate' }
                            ].map((stat, i) => (
                                <div key={i}>
                                    <p className="text-2xl font-bold text-primary">{stat.num}</p>
                                    <p className="text-sm text-base-content/60">{stat.label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="hidden lg:flex items-center justify-center"
                    >
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                className="w-80 h-80 border-2 border-dashed border-primary/30 rounded-full flex items-center justify-center"
                            >
                                <div className="w-60 h-60 border border-primary/20 rounded-full flex items-center justify-center bg-primary/5">
                                    <GiSewingMachine className="text-8xl text-primary/80" />
                                </div>
                            </motion.div>

                            {[
                                { label: 'Cutting', pos: 'top-0 left-0', delay: 0 },
                                { label: 'Sewing', pos: 'top-0 right-0', delay: 0.5 },
                                { label: 'QC Check', pos: 'bottom-0 left-0', delay: 1 },
                                { label: 'Shipped', pos: 'bottom-0 right-0', delay: 1.5 },
                            ].map((badge, i) => (
                                <motion.div
                                    key={i}
                                    className={`absolute ${badge.pos} bg-base-100 px-4 py-2 rounded-xl shadow-xl`}
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: badge.delay }}
                                >
                                    <span className="text-sm font-semibold text-base-content">{badge.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroBanner;
