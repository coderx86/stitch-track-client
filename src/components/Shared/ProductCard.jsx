import { motion } from 'framer-motion';
import { Link } from 'react-router';

const ProductCard = ({ product, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
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
    );
};

export default ProductCard;
