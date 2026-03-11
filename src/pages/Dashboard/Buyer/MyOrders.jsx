import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { FiXCircle, FiEye, FiTruck, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router';

const MyOrders = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data = {}, isLoading } = useQuery({
        queryKey: ['my-orders', page],
        queryFn: async () => {
             const res = await axiosSecure.get('/orders/my-orders');
             const allData = res.data;
             
             const startIndex = (page - 1) * limit;
             const endIndex = startIndex + limit;
             const paginatedData = allData.slice(startIndex, endIndex);
             
             return {
                 orders: paginatedData,
                 total: allData.length,
                 totalPages: Math.ceil(allData.length / limit)
             };
        }
    });

    const { orders = [], totalPages = 1 } = data;

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
        const colors = { 
            pending: 'bg-warning/20 text-warning border-warning/20', 
            approved: 'bg-info/20 text-info border-info/20', 
            processing: 'bg-primary/20 text-primary border-primary/20',
            shipped: 'bg-secondary/20 text-secondary border-secondary/20',
            completed: 'bg-success/20 text-success border-success/20',
            rejected: 'bg-error/20 text-error border-error/20', 
            cancelled: 'bg-base-300 text-base-content/70 border-base-300' 
        };
        return <span className={`badge badge-sm border font-medium ${colors[status] || 'badge-ghost'} capitalize py-3 px-3`}>{status}</span>;
    };

    return (
        <div>
            <h1 className="text-2xl font-extrabold mb-6">My Orders</h1>

            {isLoading ? (
                <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 text-base-content/50">
                    <p className="text-lg">No orders yet</p>
                    <Link to="/all-products" className="btn btn-primary btn-sm mt-4">Browse Products</Link>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead className="text-base-content/60 text-sm">
                            <tr>
                                <th>#</th>
                                <th>Tracking ID</th>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Payment</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o, i) => (
                                <tr key={o._id}>
                                    <td>{(page - 1) * limit + i + 1}</td>
                                    <td>
                                        {(o.status === 'approved' || o.status === 'completed') ? (
                                            <Link to={`/dashboard/track-order/${o._id}`} className="badge badge-ghost font-mono text-xs">
                                                ST-{o._id.slice(-6).toUpperCase()}
                                            </Link>
                                        ) : (
                                            <span className="text-xs text-base-content/40">—</span>
                                        )}
                                    </td>
                                    <td className="font-bold">{o.productTitle}</td>
                                    <td>{o.quantity}</td>
                                    <td className="font-bold text-primary">${o.totalPrice}</td>
                                    <td>{statusBadge(o.status)}</td>
                                    <td>
                                        <span className={`badge badge-sm font-medium py-3 px-3 capitalize ${o.paymentStatus === 'paid' ? 'bg-success/20 text-success border-success/20' : 'bg-warning/20 text-warning border-warning/20'} border`}>
                                            {o.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                                        </span>
                                    </td>
                                    <td className="text-sm text-base-content/70">{new Date(o.orderedAt).toLocaleString()}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            {o.status !== 'completed' && o.paymentStatus !== 'paid' && o.paymentMethod === 'payfirst' && (
                                                <Link to={`/dashboard/payment/${o._id}`} className="btn btn-primary btn-xs">Pay</Link>
                                            )}
                                            {o.status === 'pending' ? (
                                                <button className="btn btn-error btn-xs btn-outline" onClick={() => handleCancel(o._id)} title="Cancel Order">
                                                    <FiXCircle />
                                                </button>
                                            ) : (
                                                <div title="You can't cancel this order. To cancel this order, please contact us.">
                                                    <button className="btn btn-error btn-xs btn-outline" disabled>
                                                        <FiXCircle />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6 py-4">
                            <div className="join shadow-sm">
                                <button 
                                    className="join-item btn btn-sm" 
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    <FiChevronLeft />
                                </button>
                                {[...Array(totalPages)].map((_, idx) => (
                                    <button 
                                        key={idx}
                                        className={`join-item btn btn-sm ${page === idx + 1 ? 'btn-primary' : ''}`}
                                        onClick={() => setPage(idx + 1)}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                                <button 
                                    className="join-item btn btn-sm" 
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                >
                                    <FiChevronRight />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
