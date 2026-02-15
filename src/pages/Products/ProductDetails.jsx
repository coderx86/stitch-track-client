import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';
import useRole from '../../hooks/useRole';
import Loading from '../../components/Loading/Loading';

const ProductDetails = () => {
    const { id } = useParams();
    const axios = useAxios();
    const { user } = useAuth();
    const { role } = useRole();

    const { data: product, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const res = await axios.get(`/products/${id}`);
            return res.data;
        }
    });

    if (isLoading) return <Loading />;
    if (!product) return <div className="text-center py-20 text-xl">Product not found</div>;

    const canOrder = user && role === 'buyer';

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="grid lg:grid-cols-2 gap-10">
                {/* Images */}
                <div className="space-y-4">
                    <div className="rounded-2xl overflow-hidden border border-base-300">
                        <img
                            src={product.images?.[0] || 'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp'}
                            alt={product.title}
                            className="w-full h-96 object-cover"
                        />
                    </div>
                    {product.images?.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                            {product.images.slice(1, 5).map((img, i) => (
                                <div key={i} className="rounded-lg overflow-hidden border border-base-300">
                                    <img src={img} alt="" className="w-full h-20 object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                    {product.demoVideo && (
                        <div className="rounded-xl overflow-hidden border border-base-300">
                            <iframe src={product.demoVideo} className="w-full h-64" allowFullScreen title="Demo Video"></iframe>
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="space-y-6">
                    <div>
                        <span className="badge badge-primary badge-lg">{product.category}</span>
                        <h1 className="text-3xl font-extrabold mt-3">{product.title}</h1>
                    </div>

                    <p className="text-base-content/70 leading-relaxed">{product.description}</p>

                    <div className="bg-base-200 rounded-xl p-6 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-base-content/60">Price</span>
                            <span className="text-3xl font-bold text-primary">${product.price}</span>
                        </div>
                        <div className="divider my-1"></div>
                        <div className="flex justify-between">
                            <span className="text-base-content/60">Available Quantity</span>
                            <span className="font-semibold">{product.quantity}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-base-content/60">Minimum Order</span>
                            <span className="font-semibold">{product.moq || 1}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-base-content/60">Payment</span>
                            <span className="font-semibold capitalize">{product.paymentOption === 'cod' ? 'Cash on Delivery' : 'PayFirst (Stripe)'}</span>
                        </div>
                    </div>

                    {canOrder ? (
                        <Link to={`/book-product/${product._id}`} className="btn btn-primary btn-lg w-full shadow-lg shadow-primary/25">
                            Order Now
                        </Link>
                    ) : user ? (
                        <div className="alert alert-info">
                            <span>Only buyers can place orders. Your role: <strong className="capitalize">{role}</strong></span>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary btn-lg w-full">
                            Login to Order
                        </Link>
                    )}

                    {(role === 'admin' || role === 'manager') && (
                        <div className="text-sm text-base-content/50">
                            Listed by: {product.createdBy}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
