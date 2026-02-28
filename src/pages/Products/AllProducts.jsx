import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router';
import { useState } from 'react';
import { motion } from 'framer-motion';
import useAxios from '../../hooks/useAxios';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const LIMIT_OPTIONS = [6, 12, 24];

const AllProducts = () => {
    const axios = useAxios();
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [limit, setLimit] = useState(parseInt(searchParams.get('limit') || '12'));
    const page = parseInt(searchParams.get('page') || '1');

    const { data, isLoading } = useQuery({
        queryKey: ['all-products', search, category, page, limit],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (category) params.append('category', category);
            params.append('page', page);
            params.append('limit', limit);
            const res = await axios.get(`/products?${params.toString()}`);
            return res.data;
        }
    });

    const products = data?.products || [];
    const totalPages = data?.totalPages || 1;
    const total = data?.total || 0;

    const updateParams = (updates) => {
        const params = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([k, v]) => params.set(k, v));
        setSearchParams(params);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        updateParams({ search, category, page: 1, limit });
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        updateParams({ limit: newLimit, page: 1 });
    };

    const handlePageChange = (newPage) => {
        updateParams({ page: newPage });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-extrabold">All Products</h1>
                <p className="text-base-content/60 mt-2">Browse our complete garment collection</p>
            </motion.div>

            {/* Search & Filter */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row justify-between gap-2 mb-6 max-w-2xl mx-auto w-full">
                <label className="border border-base-300 px-4 flex items-center gap-2 w-full focus-within:border-primary transition-colors bg-base-100">
                    <FiSearch className="text-base-content/40" />
                    <input type="text" placeholder="Search products..." className="grow outline-none w-full"
                        value={search} onChange={(e) => setSearch(e.target.value)} />
                </label>
                <div className="flex gap-2 w-full">
                    <select className="border border-base-300 px-4 focus-within:border-primary transition-colors bg-base-100 flex-1"
                        value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">All Categories</option>
                        <option value="Shirt">Shirt</option>
                        <option value="Pant">Pant</option>
                        <option value="Jacket">Jacket</option>
                        <option value="Accessories">Accessories</option>
                    </select>
                    <button type="submit" className="btn btn-primary flex-1">Search</button>
                </div>
            </form>

            {/* Top bar: results info + per-page selector — single row */}
            {!isLoading && (
                <div className="flex items-center justify-between gap-3 mb-6">
                    <p className="text-sm text-base-content/60">
                        Showing <span className="font-semibold text-base-content">{products.length}</span> of <span className="font-semibold text-base-content">{total}</span> products
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
            )}

            {/* Products Grid */}
            {isLoading ? (
                <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>
            ) : products.length === 0 ? (
                <div className="text-center py-20"><p className="text-xl text-base-content/50">No products found</p></div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product, i) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-xl transition-all group"
                            >
                                <figure className="relative overflow-hidden">
                                    <img
                                        src={product.images?.[0] || 'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp'}
                                        alt={product.title}
                                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3 badge badge-primary font-semibold">${product.price}</div>
                                </figure>
                                <div className="card-body">
                                    <h3 className="card-title text-lg">{product.title}</h3>
                                    <div className="flex items-center justify-between">
                                        <span className="badge badge-outline badge-sm">{product.category}</span>
                                        <span className="text-sm text-base-content/50">Qty: {product.quantity}</span>
                                    </div>
                                    <div className="card-actions mt-3">
                                        <Link to={`/product/${product._id}`} className="btn btn-primary btn-sm w-full">View Details</Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10">
                            <p className="text-sm text-base-content/60">
                                Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span>
                            </p>
                            <div className="flex items-center gap-2">
                                <button className="btn btn-sm btn-outline gap-1"
                                    onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                                    <FiChevronLeft /> Prev
                                </button>
                                <div className="join">
                                    {[...Array(totalPages)].map((_, i) => {
                                        const p = i + 1;
                                        if (totalPages <= 7 || p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                                            return (
                                                <button key={p}
                                                    className={`join-item btn btn-sm ${page === p ? 'btn-primary' : 'btn-outline'}`}
                                                    onClick={() => handlePageChange(p)}>
                                                    {p}
                                                </button>
                                            );
                                        if (Math.abs(p - page) === 2) return <button key={p} className="join-item btn btn-sm btn-disabled">…</button>;
                                        return null;
                                    })}
                                </div>
                                <button className="btn btn-sm btn-outline gap-1"
                                    onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
                                    Next <FiChevronRight />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AllProducts;
