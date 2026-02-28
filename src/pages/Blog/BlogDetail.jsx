import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router';
import { FiUser, FiClock, FiCalendar, FiArrowLeft, FiTag } from 'react-icons/fi';
import { BLOG_POSTS } from '../Home/BlogPreview';

const EXTRA_POSTS = [
    {
        slug: 'sustainable-garment-manufacturing',
        title: 'Sustainable Practices in Garment Manufacturing',
        excerpt: 'How eco-friendly materials, ethical labor practices, and zero-waste manufacturing are reshaping the global garment industry.',
        author: 'Nadia Islam',
        date: 'Mar 5, 2025',
        readTime: '6 min read',
        category: 'Sustainability',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop',
        content: `Sustainability has become a central concern in the garment industry. From organic cotton to recycled synthetics, manufacturers are finding innovative ways to reduce their environmental footprint.

**Key sustainable practices include:**
- Using GOTS-certified organic cotton
- Implementing zero-liquid discharge (ZLD) systems
- Switching to water-based dyes
- Installing solar panels for energy offset
- Creating zero-waste cutting patterns

Beyond materials, ethical labor practices — fair wages, safe working conditions, no child labor — are essential components of a sustainable supply chain.

StitchTrack helps factories document their sustainability certifications and track compliance metrics alongside production data.`
    },
    {
        slug: 'quality-control-garment-factories',
        title: 'Quality Control Best Practices for Garment Factories',
        excerpt: 'From inline inspection to final audit, discover how top garment factories maintain consistent quality standards throughout production.',
        author: 'Karim Ahmed',
        date: 'Mar 18, 2025',
        readTime: '8 min read',
        category: 'Quality',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=400&fit=crop',
        content: `Quality control in garment manufacturing is a multi-stage process. The best factories implement checks at every stage of production — not just at the end.

**The four pillars of garment QC:**
1. **Pre-production**: Fabric inspection, trims check, sample approval
2. **Inline inspection**: Checking stitching, sizing, and appearance during production
3. **Final Random Inspection (FRI)**: Sampling finished goods using AQL standards
4. **Packing & shipment check**: Verifying correct labeling, quantities, and export documentation

StitchTrack enables managers to log QC updates at each production stage, giving buyers real-time visibility into quality compliance.`
    },
];

const ALL_POSTS = [...BLOG_POSTS.map(p => ({ ...p, content: `This is the full content for "${p.title}". The garment industry is one of the world's largest and most complex global supply chains. Tracking production from raw fabric to finished garment requires sophisticated tools, clear communication between stakeholders, and data-driven decision making.\n\n**Key topics covered:**\n- Industry overview and challenges\n- How StitchTrack solves common pain points\n- Best practices for production management\n- Case studies from Bangladesh factories\n\nStitchTrack was designed from the ground up to address the needs of modern garment production teams. Whether you're a small boutique factory or a large export-oriented manufacturer, our platform scales with your needs.` })), ...EXTRA_POSTS];

const BlogDetail = () => {
    const { slug } = useParams();
    const post = ALL_POSTS.find(p => p.slug === slug);

    if (!post) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-24 text-center">
                <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
                <Link to="/blog" className="btn btn-primary">← Back to Blog</Link>
            </div>
        );
    }

    const related = ALL_POSTS.filter(p => p.slug !== slug && p.category === post.category).slice(0, 2);

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <Link to="/blog" className="btn btn-ghost btn-sm gap-1 mb-6"><FiArrowLeft /> Back to Blog</Link>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <span className="badge badge-primary badge-outline mb-4"><FiTag className="mr-1" />{post.category}</span>
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">{post.title}</h1>

                <div className="flex flex-wrap gap-4 text-sm text-base-content/60 mb-8 pb-6 border-b border-base-200">
                    <span className="flex items-center gap-1.5"><FiUser /> {post.author}</span>
                    <span className="flex items-center gap-1.5"><FiCalendar /> {post.date}</span>
                    <span className="flex items-center gap-1.5"><FiClock /> {post.readTime}</span>
                </div>

                <figure className="rounded-2xl overflow-hidden mb-8 h-72 md:h-96">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                </figure>

                <div className="prose prose-base max-w-none text-base-content/80 leading-relaxed space-y-4">
                    <p className="text-lg font-medium text-base-content">{post.excerpt}</p>
                    {(post.content || '').split('\n\n').map((para, i) => (
                        <p key={i} className="whitespace-pre-line">{para}</p>
                    ))}
                </div>
            </motion.div>

            {related.length > 0 && (
                <div className="mt-16 pt-8 border-t border-base-200">
                    <h2 className="text-xl font-bold mb-6">Related Articles</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {related.map(p => (
                            <Link key={p.slug} to={`/blog/${p.slug}`} className="card bg-base-100 border border-base-300 hover:border-primary/40 hover:shadow-md transition-all overflow-hidden group flex-row">
                                <figure className="w-28 shrink-0 overflow-hidden">
                                    <img src={p.image} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </figure>
                                <div className="p-4">
                                    <span className="badge badge-sm badge-outline badge-primary mb-1">{p.category}</span>
                                    <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">{p.title}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogDetail;
