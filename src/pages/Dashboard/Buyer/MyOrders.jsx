import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FiXCircle } from 'react-icons/fi';
import { Link } from 'react-router';

const MyOrders = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const { data: orders = [], isLoading } = useQuery({
        queryKey: ['my-orders'],
        queryFn: async () => (await axiosSecure.get('/orders/my-orders')).data
    });

    const cancelMutation = useMutation({
        mutationFn: async (id) => axiosSecure.patch(`/orders/${id}/cancel`),
        onSuccess: () => {
            queryClient.invalidateQueries(['my-orders']);
            Swal.fire({ icon: 'success', title: 'Order Cancelled', timer: 1500, showConfirmButton: false });
        },
        onError: (error) => {
            Swal.fire({ icon: 'error', title: 'Failed', text: error.response?.data?.message || error.message });
        }
    });

    const handleCancel = (id) => {
        Swal.fire({
            title: 'Cancel this order?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, cancel it!'
        }).then((result) => {
            if (result.isConfirmed) cancelMutation.mutate(id);
        });
    };

    const statusBadge = (status) => {
        const colors = { pending: 'badge-warning', approved: 'badge-success', completed: 'badge-primary', rejected: 'badge-error', cancelled: 'badge-ghost' };
        return <span className={`badge badge-sm ${colors[status] || 'badge-ghost'} capitalize`}>{status}</span>;
    };

    return (
        <div>
            <h1 className="text-2xl font-extrabold mb-6">My Orders (Cart)</h1>
            {isLoading ? (
                <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 text-base-content/50">
                    <p className="text-lg">No items in your cart/orders yet</p>
                    <Link to="/all-products" className="btn btn-primary btn-sm mt-4">Browse Products</Link>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead className="text-base-content/60 text-sm">
                            <tr>
                                <th>#</th>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o, i) => (
                                <tr key={o._id}>
                                    <td>{i + 1}</td>
                                    <td className="font-bold">{o.productTitle}</td>
                                    <td>{o.quantity}</td>
                                    <td className="font-bold text-primary">${o.totalPrice}</td>
                                    <td>{statusBadge(o.status)}</td>
                                    <td>
                                        {o.status === 'pending' && (
                                            <button className="btn btn-error btn-xs btn-outline" onClick={() => handleCancel(o._id)} title="Cancel/Delete">
                                                <FiXCircle />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyOrders;
