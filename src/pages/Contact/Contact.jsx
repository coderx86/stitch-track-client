import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiUser, FiFileText } from 'react-icons/fi';
import Swal from 'sweetalert2';

const Contact = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        Swal.fire({ icon: 'success', title: 'Message Sent!', text: 'We\'ll get back to you shortly.', timer: 2000, showConfirmButton: false });
        e.target.reset();
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold">Get in <span className="text-primary">Touch</span></h1>
                <p className="text-base-content/50 mt-4 max-w-xl mx-auto">
                    Have questions about garment production or tracking? We'd love to hear from you.
                </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Info */}
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
                    <h2 className="text-2xl font-bold">Contact Information</h2>
                    {[
                        { icon: <FiMapPin />, title: 'Address', desc: '123 Garment District, Dhaka 1000, Bangladesh' },
                        { icon: <FiMail />, title: 'Email', desc: 'hello@stitchtrack.com' },
                        { icon: <FiPhone />, title: 'Phone', desc: '+880 1234-567890' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-xl shrink-0">{item.icon}</div>
                            <div>
                                <h3 className="font-bold">{item.title}</h3>
                                <p className="text-base-content/50 text-sm">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Contact Form */}
                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                    <form onSubmit={handleSubmit} className="card bg-base-100 border border-base-300 p-6 md:p-8 rounded-2xl space-y-5">
                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">Your Name</label>
                                <div className="flex items-center gap-3 border border-base-300 rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
                                    <FiUser className="text-base-content/30 text-lg shrink-0" />
                                    <input type="text" placeholder="Enter your full name" className="bg-transparent outline-none w-full text-sm placeholder:text-base-content/30" required />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">E-Mail Address</label>
                                <div className="flex items-center gap-3 border border-base-300 rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
                                    <FiMail className="text-base-content/30 text-lg shrink-0" />
                                    <input type="email" placeholder="Enter your E-mail address" className="bg-transparent outline-none w-full text-sm placeholder:text-base-content/30" required />
                                </div>
                            </div>
                        </div>

                        <div className="border-b border-base-200"></div>

                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">Subject</label>
                            <div className="flex items-center gap-3 border border-base-300 rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
                                <FiFileText className="text-base-content/30 text-lg shrink-0" />
                                <input type="text" placeholder="How can we help?" className="bg-transparent outline-none w-full text-sm placeholder:text-base-content/30" required />
                            </div>
                        </div>

                        <div className="border-b border-base-200"></div>

                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">Message</label>
                            <div className="flex items-start gap-3 border border-base-300 rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
                                <FiFileText className="text-base-content/30 text-lg shrink-0 mt-0.5" />
                                <textarea placeholder="Your message..." className="bg-transparent outline-none w-full text-sm resize-none placeholder:text-base-content/30" rows={4} required />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-full rounded-xl text-base h-12 gap-2"><FiSend /> Send Message</button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
