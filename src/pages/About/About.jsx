import { motion } from 'framer-motion';
import { GiSewingMachine } from 'react-icons/gi';
import { FiUsers, FiTarget, FiAward, FiGlobe } from 'react-icons/fi';

const About = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold">About <span className="text-primary">StitchTrack</span></h1>
                <p className="text-base-content/60 mt-4 max-w-2xl mx-auto text-lg">
                    Empowering garment manufacturers and buyers with a streamlined production tracking platform.
                </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
                    <h2 className="text-3xl font-bold">Our Mission</h2>
                    <p className="text-base-content/70 leading-relaxed">
                        StitchTrack bridges the gap between garment manufacturers and buyers. We provide
                        a transparent, real-time tracking system that ensures every order is manufactured
                        with quality and delivered on time.
                    </p>
                    <p className="text-base-content/70 leading-relaxed">
                        From cutting rooms to shipping docks, our platform digitizes the entire production
                        workflow, giving managers unprecedented control and buyers complete peace of mind.
                    </p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex justify-center">
                    <div className="w-72 h-72 bg-primary/10 rounded-3xl flex items-center justify-center">
                        <GiSewingMachine className="text-9xl text-primary" />
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { icon: <FiUsers />, title: 'Team', desc: '50+ skilled professionals' },
                    { icon: <FiTarget />, title: 'Accuracy', desc: '99.5% on-time delivery' },
                    { icon: <FiAward />, title: 'Quality', desc: 'ISO 9001 certified' },
                    { icon: <FiGlobe />, title: 'Reach', desc: 'Operating in 12+ countries' },
                ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                        className="card bg-base-200 border border-base-300 p-6 text-center">
                        <div className="text-3xl text-primary mb-3 flex justify-center">{item.icon}</div>
                        <h3 className="font-bold text-lg">{item.title}</h3>
                        <p className="text-base-content/60 text-sm mt-1">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default About;
