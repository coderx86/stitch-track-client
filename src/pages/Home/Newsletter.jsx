import { motion } from 'framer-motion';

const Newsletter = () => {
    return (
        <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold text-primary-content">Stay Updated</h2>
                    <p className="text-primary-content/80 max-w-xl mx-auto">
                        Subscribe to our newsletter for the latest updates on production trends, new features, and exclusive offers.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="input input-bordered flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/50"
                        />
                        <button className="btn bg-secondary text-secondary-content hover:bg-secondary/80 border-none">
                            Subscribe
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Newsletter;
