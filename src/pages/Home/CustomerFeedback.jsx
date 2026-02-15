import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const feedbacks = [
    { name: 'Rafiq Ahmed', role: 'Fashion Retailer', rating: 5, comment: 'StitchTrack transformed our order management. We now track every garment from cutting to delivery seamlessly!', avatar: 'https://ui-avatars.com/api/?name=Rafiq+Ahmed&background=f59e0b&color=0f172a' },
    { name: 'Nusrat Jahan', role: 'Boutique Owner', rating: 5, comment: 'The production timeline feature is amazing. I always know exactly where my orders are in the pipeline.', avatar: 'https://ui-avatars.com/api/?name=Nusrat+Jahan&background=6366f1&color=ffffff' },
    { name: 'Kamal Hassan', role: 'Wholesale Buyer', rating: 4, comment: 'Quality control tracking gives me confidence in every order. The platform is intuitive and professional.', avatar: 'https://ui-avatars.com/api/?name=Kamal+Hassan&background=22c55e&color=ffffff' },
    { name: 'Fatema Begum', role: 'Export Manager', rating: 5, comment: 'Managing 100+ orders has never been easier. The dashboard analytics help us make data-driven decisions.', avatar: 'https://ui-avatars.com/api/?name=Fatema+Begum&background=ef4444&color=ffffff' },
    { name: 'Imran Khan', role: 'Factory Owner', rating: 5, comment: 'Our production efficiency increased by 40% after implementing StitchTrack. Highly recommended!', avatar: 'https://ui-avatars.com/api/?name=Imran+Khan&background=3b82f6&color=ffffff' },
];

const CustomerFeedback = () => {
    return (
        <section className="py-20 bg-base-100">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="text-primary font-semibold text-sm uppercase tracking-widest">Testimonials</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold mt-2 text-base-content">What Our Clients Say</h2>
                </motion.div>

                <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={24}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    className="pb-12"
                >
                    {feedbacks.map((fb, i) => (
                        <SwiperSlide key={i}>
                            <div className="card bg-base-200 border border-base-300 p-6 h-full">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="avatar">
                                        <div className="w-12 rounded-full">
                                            <img src={fb.avatar} alt={fb.name} />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">{fb.name}</h4>
                                        <p className="text-xs text-base-content/50">{fb.role}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 mb-3">
                                    {[...Array(5)].map((_, j) => (
                                        <FaStar key={j} className={j < fb.rating ? 'text-primary' : 'text-base-300'} />
                                    ))}
                                </div>
                                <p className="text-base-content/70 text-sm leading-relaxed italic">"{fb.comment}"</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default CustomerFeedback;
