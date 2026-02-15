import { motion } from 'framer-motion';
import { GiSewingMachine } from 'react-icons/gi';
import { FiUsers, FiTarget, FiAward, FiGlobe } from 'react-icons/fi';

const About = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">About <span className="text-primary">StitchTrack</span></h1>
                <p className="text-base-content/60 mt-4 max-w-2xl mx-auto text-lg leading-relaxed">
                    Empowering the garment industry with transparency, efficiency, and real-time production tracking for manufacturers and buyers globally.
                </p>
            </motion.div>
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
                    <h2 className="text-3xl font-bold border-l-4 border-primary pl-4">Our Vision</h2>
                    <p className="text-base-content/70 leading-relaxed text-lg italic">"Connecting needles to storefronts through smarter data."</p>
                    <p className="text-base-content/70 leading-relaxed">
                        At StitchTrack, we believe that transparency is the key to sustainable and efficient garment production. Our platform digitizes every step of the manufacturing process, from initial cutting to final quality checks and shipping.
                    </p>
                </motion.div>
                <div className="flex justify-center"><div className="w-80 h-80 bg-primary/5 rounded-[40px] flex items-center justify-center rotate-3 border border-primary/10 hover:rotate-0 transition-transform duration-500 shadow-2xl shadow-primary/5"><GiSewingMachine className="text-9xl text-primary drop-shadow-lg" /></div></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { icon: <FiUsers />, title: '50+ Professionals', desc: 'Expert team across logistics and tech' },
                    { icon: <FiTarget />, title: '99% Accuracy', desc: 'Precise delivery estimation system' },
                    { icon: <FiAward />, title: 'Global Standard', desc: 'Certified production management' },
                    { icon: <FiGlobe />, title: '12+ Countries', desc: 'Supporting international supply chains' },
                ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                        className="p-8 rounded-3xl bg-base-100 border border-base-300 hover:border-primary/30 transition-colors group shadow-sm">
                        <div className="text-4xl text-primary mb-5 group-hover:scale-110 transition-transform flex justify-center">{item.icon}</div>
                        <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                        <p className="text-base-content/50 text-sm">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default About;
