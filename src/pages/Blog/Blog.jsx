import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { FiArrowRight, FiClock, FiUser, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useState, useMemo } from 'react';
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
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop'
    },
    {
        slug: 'quality-control-garment-factories',
        title: 'Quality Control Best Practices for Garment Factories',
        excerpt: 'From inline inspection to final audit, discover how top garment factories maintain consistent quality standards throughout production.',
        author: 'Karim Ahmed',
        date: 'Mar 18, 2025',
        readTime: '8 min read',
        category: 'Quality',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=400&fit=crop'
    },
];

const ALL_POSTS = [...BLOG_POSTS, ...EXTRA_POSTS];
const ALL_CATEGORIES = ['All', ...new Set(ALL_POSTS.map(p => p.category))];
const LIMIT_OPTIONS = [6, 12, 24];

const Blog = () => {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [limit, setLimit] = useState(6);
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => ALL_POSTS.filter(p => {
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.excerpt.toLowerCase().includes(search.toLowerCase());
        const matchCat = activeCategory === 'All' || p.category === activeCategory;
        return matchSearch && matchCat;
    }), [search, activeCategory]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
    const safePage = Math.min(page, totalPages);
    const paginated = filtered.slice((safePage - 1) * limit, safePage * limit);

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1);
    };

    const handleFilterChange = (cat) => {
        setActiveCategory(cat);
        setPage(1);
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold">StitchTrack <span className="text-primary">Blog</span></h1>
                <p className="text-base-content/50 mt-4 max-w-xl mx-auto">
                    Industry insights, production tips, and platform updates from the garment tracking experts
                </p>
            </motion.div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-2 mb-6">
                <div className="flex items-center gap-2 border border-base-300 px-4 py-2.5 max-w-full focus-within:border-primary transition-colors bg-base-100">
                    <FiSearch className="text-base-content/40 shrink-0" />
                    <input type="text" placeholder="Search posts..." className="bg-transparent outline-none flex-1 text-sm"
                        value={search} onChange={handleSearch} />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {ALL_CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => handleFilterChange(cat)}
                            className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-outline'}`}>
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Top bar: results + per-page selector — single row */}
            <div className="flex items-center justify-between gap-3 mb-8">
                <p className="text-sm text-base-content/60">
                    Showing <span className="font-semibold text-base-content">{paginated.length}</span> of <span className="font-semibold text-base-content">{filtered.length}</span> posts
                </p>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-base-content/60 hidden sm:block">Show:</span>
                    <select className="select select-bordered select-sm"
                        value={limit}
                        onChange={(e) => handleLimitChange(Number(e.target.value))}>
                        {LIMIT_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt} / page</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Posts grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginated.length === 0 ? (
                    <div className="col-span-3 text-center py-16 text-base-content/50">No posts found for your search.</div>
                ) : paginated.map((post, i) => (
                    <motion.div key={post.slug}
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                        className="card bg-base-100 border border-base-300 overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all group"
                    >
                        <figure className="overflow-hidden h-48">
                            <img src={post.image} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </figure>
                        <div className="card-body p-5">
                            <span className="badge badge-primary badge-outline badge-sm">{post.category}</span>
                            <h2 className="font-bold text-base leading-snug mt-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h2>
                            <p className="text-base-content/60 text-sm line-clamp-2">{post.excerpt}</p>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-base-200 text-xs text-base-content/50">
                                <span className="flex items-center gap-1"><FiUser className="shrink-0" /> {post.author}</span>
                                <span className="flex items-center gap-1"><FiClock className="shrink-0" /> {post.readTime}</span>
                            </div>
                            <Link to={`/blog/${post.slug}`} className="btn btn-primary btn-sm mt-3 gap-1">Read More <FiArrowRight /></Link>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10">
                    <p className="text-sm text-base-content/60">
                        Page <span className="font-semibold">{safePage}</span> of <span className="font-semibold">{totalPages}</span>
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="btn btn-sm btn-outline gap-1"
                            onClick={() => setPage(p => p - 1)} disabled={safePage === 1}>
                            <FiChevronLeft /> Prev
                        </button>
                        <div className="join">
                            {[...Array(totalPages)].map((_, i) => {
                                const p = i + 1;
                                return (
                                    <button key={p}
                                        className={`join-item btn btn-sm ${safePage === p ? 'btn-primary' : 'btn-outline'}`}
                                        onClick={() => setPage(p)}>
                                        {p}
                                    </button>
                                );
                            })}
                        </div>
                        <button className="btn btn-sm btn-outline gap-1"
                            onClick={() => setPage(p => p + 1)} disabled={safePage === totalPages}>
                            Next <FiChevronRight />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Blog;
