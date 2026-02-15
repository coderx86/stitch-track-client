import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import useAxios from '../../hooks/useAxios';

const OurProducts = () => {
    const axios = useAxios();

    const { data: products = [], isLoading } = useQuery({
        queryKey: ['home-products'],
        queryFn: async () => {
            const res = await axios.get('/products/home');
            return res.data;
        }
    });

    return (
        <section className="py-20 bg-base-100">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="text-primary font-semibold text-sm uppercase tracking-widest">Our Collection</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold mt-2 text-base-content">Featured Products</h2>
                    <p className="text-base-content/60 mt-3 max-w-xl mx-auto">
                        Explore our premium garment collection crafted with precision and quality.
                    </p>
                </motion.div>

                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-10 text-base-content/50">
                        <p className="text-lg">No featured products yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product, index) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-xl transition-all duration-300 group"
                            >
                                <figure className="relative overflow-hidden">
                                    <img
                                        src={product.images?.[0] || 'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp'}
                                        alt={product.title}
                                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3 badge badge-primary font-semibold">
                                        ${product.price}
                                    </div>
                                </figure>
                                <div className="card-body">
                                    <h3 className="card-title text-lg">{product.title}</h3>
                                    <p className="text-base-content/60 text-sm line-clamp-2">{product.description}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="badge badge-outline badge-sm">{product.category}</span>
                                        <span className="text-sm text-base-content/50">Qty: {product.quantity}</span>
                                    </div>
                                    <div className="card-actions mt-4">
                                        <Link to={`/product/${product._id}`} className="btn btn-primary btn-sm w-full">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-10">
                    <Link to="/all-products" className="btn btn-outline btn-primary">
                        View All Products →
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default OurProducts;
