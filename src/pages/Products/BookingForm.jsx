import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router';
import { useForm, useWatch } from 'react-hook-form';
import { useEffect } from 'react';
import useAxios from '../../hooks/useAxios';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import Loading from '../../components/Loading/Loading';

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
    const quantity = useWatch({ control, name: 'quantity', defaultValue: 1 });
    
    useEffect(() => {
        if (product) setValue('quantity', product.moq || 1);
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

            await axiosSecure.post('/orders', orderData);
            Swal.fire({ icon: 'success', title: 'Order Placed!', timer: 2000, showConfirmButton: false });
            navigate('/dashboard/my-orders');
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Order Failed', text: error.response?.data?.message || error.message });
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-extrabold mb-8">Place Your Order</h1>
            <div className="card bg-base-100 border border-base-300 shadow-sm rounded-2xl p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                        <input type="text" placeholder="First Name" className="input input-bordered w-full" {...register('firstName', { required: true })} />
                        <input type="text" placeholder="Last Name" className="input input-bordered w-full" {...register('lastName', { required: true })} />
                    </div>
                    <input type="tel" placeholder="Contact Number" className="input input-bordered w-full" {...register('contactNumber', { required: true })} />
                    <textarea placeholder="Delivery Address" className="textarea textarea-bordered w-full" {...register('deliveryAddress', { required: true })} />
                    <input type="number" step="1" className="input input-bordered w-full" {...register('quantity', { required: true, min: product.moq || 1 })} />
                    <div className="p-4 bg-base-200 rounded-lg font-bold text-center text-xl">Total: ${orderPrice.toFixed(2)}</div>
                    <button type="submit" className="btn btn-primary w-full">Confirm Order</button>
                </form>
            </div>
        </div>
    );
};

export default BookingForm;
