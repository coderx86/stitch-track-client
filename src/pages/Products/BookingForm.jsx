import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router';
import { useForm, useWatch } from 'react-hook-form';
import { useEffect } from 'react';
import useAxios from '../../hooks/useAxios';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import Loading from '../../components/Loading/Loading';
import { FiUser, FiMail, FiPhone, FiMapPin, FiFileText, FiPackage, FiHash } from 'react-icons/fi';

const BookingForm = () => {
    const { id } = useParams();
    const axios = useAxios();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const navigate = useNavigate();

    const { data: product, isLoading } = useQuery({
        queryKey: ['product-booking', id],
        queryFn: async () => {
            const res = await axios.get(`/products/${id}`);
            return res.data;
        }
    });

    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm();
    const quantity = useWatch({ control, name: 'quantity', defaultValue: product?.moq || 1 });
    
    useEffect(() => {
        if (product) { setValue('quantity', product.moq || 1);}
    }, [product, setValue]);
    const orderPrice = product ? (parseFloat(quantity) || 0) * product.price : 0;

    if (isLoading) return <Loading />;
    if (!product) return <div className="text-center py-20">Product not found</div>;

    const onSubmit = async (data) => {
        try {
            const orderData = {
                productId: product._id,
                productTitle: product.title,
                quantity: parseInt(data.quantity),
                totalPrice: orderPrice,
                firstName: data.firstName,
                lastName: data.lastName,
                contactNumber: data.contactNumber,
                deliveryAddress: data.deliveryAddress,
                notes: data.notes,
                paymentMethod: product.paymentOption
            };

            const res = await axiosSecure.post('/orders', orderData);

            if (product.paymentOption === 'payfirst' && res.data.insertedId) {
                navigate(`/dashboard/payment/${res.data.insertedId}`);
            } else {
                Swal.fire({ icon: 'success', title: 'Order Placed!', text: 'Your order has been placed successfully.', timer: 2000, showConfirmButton: false });
                navigate('/dashboard/my-orders');
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Order Failed', text: error.response?.data?.message || error.message });
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-extrabold mb-8">Place Your Order</h1>

            <div className="card bg-base-100 border border-base-300 shadow-sm rounded-2xl">
                <div className="card-body p-6 md:p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* Product Info — read-only section */}
                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">Your Email</label>
                                <div className="flex items-center gap-3 border border-base-300 rounded-xl px-4 py-3 bg-base-200/50">
                                    <FiMail className="text-base-content/30 text-lg shrink-0" />
                                    <span className="text-sm text-base-content/70 truncate">{user?.email || ''}</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">Product</label>
                                <div className="flex items-center gap-3 border border-base-300 rounded-xl px-4 py-3 bg-base-200/50">
                                    <FiPackage className="text-base-content/30 text-lg shrink-0" />
                                    <span className="text-sm text-base-content/70 truncate">{product.title}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">Unit Price</label>
                                <div className="flex items-center gap-3 border border-base-300 rounded-xl px-4 py-3 bg-base-200/50">
                                    <span className="text-base-content/30 text-lg shrink-0 font-semibold">$</span>
                                    <span className="text-sm text-base-content/70">{product.price}</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">Payment Method</label>
                                <div className="flex items-center gap-3 border border-base-300 rounded-xl px-4 py-3 bg-base-200/50">
                                    <FiFileText className="text-base-content/30 text-lg shrink-0" />
                                    <span className="text-sm text-base-content/70">{product.paymentOption === 'cod' ? 'Cash on Delivery' : 'PayFirst (Online)'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-b border-base-200"></div>

                        {/* Editable fields */}
                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">First Name</label>
                                <div className="flex items-center gap-3 border border-base-300 rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
                                    <FiUser className="text-base-content/30 text-lg shrink-0" />
                                    <input type="text" placeholder="Enter first name" className="bg-transparent outline-none w-full text-sm placeholder:text-base-content/30" {...register('firstName', { required: 'Required' })} />
                                </div>
                                {errors.firstName && <span className="text-error text-xs mt-1 block">{errors.firstName.message}</span>}
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">Last Name</label>
                                <div className="flex items-center gap-3 border border-base-300 rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
                                    <FiUser className="text-base-content/30 text-lg shrink-0" />
                                    <input type="text" placeholder="Enter last name" className="bg-transparent outline-none w-full text-sm placeholder:text-base-content/30" {...register('lastName', { required: 'Required' })} />
                                </div>
                                {errors.lastName && <span className="text-error text-xs mt-1 block">{errors.lastName.message}</span>}
                            </div>
                        </div>

                        <div className="border-b border-base-200"></div>

                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">Order Quantity</label>
                                <div className="flex items-center gap-3 border border-base-300 rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
                                    <FiHash className="text-base-content/30 text-lg shrink-0" />
                                    <input type="number" placeholder="Quantity" className="bg-transparent outline-none w-full text-sm placeholder:text-base-content/30"
                                        {...register('quantity', {
                                            required: 'Required',
                                            min: { value: product.moq || 1, message: `Min: ${product.moq || 1}` },
                                            max: { value: product.quantity, message: `Max: ${product.quantity}` }
                                        })}
                                        defaultValue={product.moq || 1}
                                        min={product.moq || 1}
                                    />
                                </div>
                                {errors.quantity && <span className="text-error text-xs mt-1 block">{errors.quantity.message}</span>}
                                <span className="text-xs text-base-content/40 mt-1 block">Min: {product.moq || 1} | Max: {product.quantity}</span>
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">Order Total</label>
                                <div className="flex items-center gap-3 border border-primary/30 rounded-xl px-4 py-3 bg-primary/5">
                                    <span className="text-primary text-lg shrink-0 font-bold">$</span>
                                    <span className="text-primary font-bold text-lg">{orderPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-b border-base-200"></div>

                        {/* Contact */}
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">Phone Number</label>
                            <div className="flex items-center gap-3 border border-base-300 rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
                                <FiPhone className="text-base-content/30 text-lg shrink-0" />
                                <input type="tel" placeholder="Enter your phone number" className="bg-transparent outline-none w-full text-sm placeholder:text-base-content/30" {...register('contactNumber', { required: 'Required' })} />
                            </div>
                            {errors.contactNumber && <span className="text-error text-xs mt-1 block">{errors.contactNumber.message}</span>}
                        </div>

                        <div className="border-b border-base-200"></div>

                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">Delivery Address</label>
                            <div className="flex items-start gap-3 border border-base-300 rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
                                <FiMapPin className="text-base-content/30 text-lg shrink-0 mt-0.5" />
                                <textarea placeholder="Full delivery address" className="bg-transparent outline-none w-full text-sm resize-none placeholder:text-base-content/30" rows={2} {...register('deliveryAddress', { required: 'Required' })} />
                            </div>
                            {errors.deliveryAddress && <span className="text-error text-xs mt-1 block">{errors.deliveryAddress.message}</span>}
                        </div>

                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">Additional Notes</label>
                            <div className="flex items-start gap-3 border border-base-300 rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
                                <FiFileText className="text-base-content/30 text-lg shrink-0 mt-0.5" />
                                <textarea placeholder="Any special instructions..." className="bg-transparent outline-none w-full text-sm resize-none placeholder:text-base-content/30" rows={2} {...register('notes')} />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-full rounded-xl text-base h-12 mt-2">
                            {product.paymentOption === 'payfirst' ? 'Proceed to Payment' : 'Place Order'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;
