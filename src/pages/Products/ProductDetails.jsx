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
                <div className="space-y-4">
                    <div className="rounded-2xl overflow-hidden border border-base-300">
                        <img src={product.images?.[0] || 'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp'} alt={product.title} className="w-full h-96 object-cover" />
                    </div>
                </div>

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
                    </div>

                    {canOrder ? (
                        <Link to={`/book-product/${product._id}`} className="btn btn-primary btn-lg w-full shadow-lg shadow-primary/25">Add to Cart (Order Now)</Link>
                    ) : user ? (
                        <div className="alert alert-info">Only buyers can place orders.</div>
                    ) : (
                        <Link to="/login" className="btn btn-primary btn-lg w-full">Login to Order</Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
