import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router';
import { useState } from 'react';
import { motion } from 'framer-motion';
import useAxios from '../../hooks/useAxios';
import { FiSearch } from 'react-icons/fi';

const AllProducts = () => {
    const axios = useAxios();
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const page = parseInt(searchParams.get('page') || '1');

    const { data, isLoading } = useQuery({
        queryKey: ['all-products', search, category, page],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (category) params.append('category', category);
            params.append('page', page);
            params.append('limit', 12);
            const res = await axios.get(`/products?${params.toString()}`);
            return res.data;
        }
    });

    const products = data?.products || [];
    const totalPages = data?.totalPages || 1;

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (category) params.set('category', category);
        params.set('page', '1');
        setSearchParams(params);
    };

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage);
        setSearchParams(params);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-extrabold">All Products</h1>
                <p className="text-base-content/60 mt-2">Browse our complete garment collection</p>
            </motion.div>

            {/* Search & Filter */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8 max-w-2xl mx-auto">
                <label className="input input-bordered flex items-center gap-2 flex-1">
                    <FiSearch className="text-base-content/40" />
                    <input type="text" placeholder="Search products..." className="grow" value={search} onChange={(e) => setSearch(e.target.value)} />
                </label>
                <select className="select select-bordered" value={category} onChange={(e) => { setCategory(e.target.value); }}>
                    <option value="">All Categories</option>
                    <option value="Shirt">Shirt</option>
                    <option value="Pant">Pant</option>
                    <option value="Jacket">Jacket</option>
                    <option value="Accessories">Accessories</option>
                </select>
                <button type="submit" className="btn btn-primary">Search</button>
            </form>

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
                                transition={{ delay: i * 0.05 }}
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
                        <div className="flex justify-center mt-10">
                            <div className="join">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        className={`join-item btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                                        onClick={() => handlePageChange(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AllProducts;
