import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiUser, FiFileText } from 'react-icons/fi';
import Swal from 'sweetalert2';

const Contact = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        Swal.fire({ icon: 'success', title: 'Message Sent!', text: 'Thank you for reaching out. We will respond shortly.', timer: 2000, showConfirmButton: false });
        e.target.reset();
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-20">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20 space-y-4">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">Connect With <span className="text-primary">StitchTrack</span></h1>
                <p className="text-base-content/50 max-w-lg mx-auto text-lg italic">"We're here to help you sew up your production loose ends."</p>
            </motion.div>
            <div className="grid lg:grid-cols-5 gap-16">
                <div className="lg:col-span-2 space-y-12">
                    <h2 className="text-3xl font-extrabold flex items-center gap-3"><span className="w-2 h-8 bg-primary rounded-full"></span>Contact Info</h2>
                    <div className="space-y-10">
                        {[
                            { icon: <FiMapPin />, title: 'Headquarters', desc: '123 Textile Plaza, Garment District, Dhaka, Bangladesh' },
                            { icon: <FiMail />, title: 'Support Email', desc: 'support@stitchtrack.io' },
                            { icon: <FiPhone />, title: 'Business Phone', desc: '+880 1800-STITCH' },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-6 group">
                                <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary text-2xl group-hover:bg-primary group-hover:text-primary-content transition-all duration-300 shadow-inner">{item.icon}</div>
                                <div className="space-y-1"><h3 className="font-bold text-lg">{item.title}</h3><p className="text-base-content/60 leading-relaxed">{item.desc}</p></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-3">
                    <form onSubmit={handleSubmit} className="card bg-base-100 border border-base-300 p-10 rounded-[40px] shadow-2xl shadow-base-content/5 space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2"><label className="text-xs font-bold uppercase tracking-[2px] text-base-content/40 ml-1">Your Full Name</label><div className="flex items-center gap-3 border border-base-300 rounded-2xl px-5 py-4 focus-within:border-primary transition-all"><FiUser className="text-base-content/20 text-xl"/><input type="text" placeholder="John Doe" className="bg-transparent outline-none w-full text-sm" required /></div></div>
                            <div className="space-y-2"><label className="text-xs font-bold uppercase tracking-[2px] text-base-content/40 ml-1">Email Address</label><div className="flex items-center gap-3 border border-base-300 rounded-2xl px-5 py-4 focus-within:border-primary transition-all"><FiMail className="text-base-content/20 text-xl"/><input type="email" placeholder="john@example.com" className="bg-transparent outline-none w-full text-sm" required /></div></div>
                        </div>
                        <div className="space-y-2"><label className="text-xs font-bold uppercase tracking-[2px] text-base-content/40 ml-1">Inquiry Subject</label><div className="flex items-center gap-3 border border-base-300 rounded-2xl px-5 py-4 focus-within:border-primary transition-all"><FiFileText className="text-base-content/20 text-xl"/><input type="text" placeholder="How can we help you?" className="bg-transparent outline-none w-full text-sm" required /></div></div>
                        <div className="space-y-2"><label className="text-xs font-bold uppercase tracking-[2px] text-base-content/40 ml-1">Your Message</label><div className="flex items-start gap-3 border border-base-300 rounded-2xl px-5 py-4 focus-within:border-primary transition-all"><FiFileText className="text-base-content/20 text-xl mt-0.5"/><textarea placeholder="Tell us about your project or needs..." className="bg-transparent outline-none w-full text-sm resize-none" rows={6} required /></div></div>
                        <button type="submit" className="btn btn-primary rounded-2xl h-16 text-lg font-black tracking-widest gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/40 group"><FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/> SEND MESSAGE</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
