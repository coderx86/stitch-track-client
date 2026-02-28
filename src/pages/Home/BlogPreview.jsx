import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { FiArrowRight, FiClock, FiUser } from 'react-icons/fi';

const BLOG_POSTS = [
    {
        slug: 'garment-production-tracking-guide',
        title: 'Complete Guide to Garment Production Tracking in 2025',
        excerpt: 'Learn how modern garment factories use digital tracking systems to reduce delays, improve quality control, and streamline order fulfillment.',
        author: 'Rahim Chowdhury',
        date: 'Jan 15, 2025',
        readTime: '7 min read',
        category: 'Production',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop'
    },
    {
        slug: 'b2b-garment-sourcing-tips',
        title: 'Top 10 Tips for B2B Garment Sourcing from Bangladesh',
        excerpt: 'Bangladesh is the world\'s second-largest garment exporter. Discover how to source efficiently, maintain quality standards, and manage supply chain risks.',
        author: 'Priya Sen',
        date: 'Feb 3, 2025',
        readTime: '5 min read',
        category: 'Sourcing',
        image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=400&fit=crop'
    },
    {
        slug: 'minimum-order-quantity-explained',
        title: 'Understanding Minimum Order Quantities (MOQ) in Garment Manufacturing',
        excerpt: 'MOQ is a critical concept for fashion buyers. We break down why MOQs exist, how to negotiate them, and strategies for smaller brands.',
        author: 'James Park',
        date: 'Feb 20, 2025',
        readTime: '4 min read',
        category: 'Business',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=400&fit=crop'
    }
];

const BlogPreview = () => {
    return (
        <section className="py-20 bg-base-200">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-3">Blog</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold">Latest <span className="text-primary">Insights</span></h2>
                        <p className="text-base-content/60 mt-2">Industry news, production tips, and platform updates</p>
                    </div>
                    <Link to="/blog" className="btn btn-outline btn-sm gap-1 shrink-0">View All Posts <FiArrowRight /></Link>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {BLOG_POSTS.map((post, i) => (
                        <motion.div key={post.slug}
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                            className="card bg-base-100 border border-base-300 overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all group"
                        >
                            <figure className="overflow-hidden h-48">
                                <img src={post.image} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </figure>
                            <div className="card-body p-5">
                                <span className="badge badge-primary badge-outline badge-sm">{post.category}</span>
                                <h3 className="font-bold text-base leading-snug mt-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                                <p className="text-base-content/60 text-sm line-clamp-2">{post.excerpt}</p>
                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-base-200 text-xs text-base-content/50">
                                    <span className="flex items-center gap-1"><FiUser /> {post.author}</span>
                                    <span className="flex items-center gap-1"><FiClock /> {post.readTime}</span>
                                </div>
                                <Link to={`/blog/${post.slug}`} className="btn btn-primary btn-sm mt-3 gap-1">
                                    Read More <FiArrowRight />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogPreview;
export { BLOG_POSTS };
