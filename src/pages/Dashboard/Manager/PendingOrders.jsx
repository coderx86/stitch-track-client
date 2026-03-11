import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { FiCheck, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const PendingOrders = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data = {}, isLoading } = useQuery({
        queryKey: ['pending-orders', page],
        queryFn: async () => {
            const res = await axiosSecure.get('/orders/pending');
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

    const approveMutation = useMutation({
        mutationFn: async (id) => axiosSecure.patch(`/orders/${id}/approve`),
        onSuccess: () => {
            queryClient.invalidateQueries(['pending-orders']);
            Swal.fire({ icon: 'success', title: 'Order Approved!', timer: 1500, showConfirmButton: false });
        }
    });

    const rejectMutation = useMutation({
        mutationFn: async (id) => axiosSecure.patch(`/orders/${id}/reject`),
        onSuccess: () => {
            queryClient.invalidateQueries(['pending-orders']);
            Swal.fire({ icon: 'success', title: 'Order Rejected', timer: 1500, showConfirmButton: false });
        }
    });

    const handleApprove = (id) => {
        Swal.fire({ title: 'Approve this order?', icon: 'question', showCancelButton: true, confirmButtonText: 'Approve' })
            .then(r => { if (r.isConfirmed) approveMutation.mutate(id); });
    };

    const handleReject = (id) => {
        Swal.fire({ title: 'Reject this order?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'Reject' })
            .then(r => { if (r.isConfirmed) rejectMutation.mutate(id); });
    };

    return (
        <div>
            <h1 className="text-2xl font-extrabold mb-6">Pending Orders</h1>

            {isLoading ? (
                <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 text-base-content/50"><p className="text-lg">No pending orders</p></div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr><th>#</th><th>Product</th><th>Buyer</th><th>Qty</th><th>Total</th><th>Date</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {orders.map((o, i) => (
                                <tr key={o._id}>
                                    <td>{(page - 1) * limit + i + 1}</td>
                                    <td className="font-medium text-sm">{o.productTitle}</td>
                                    <td className="text-sm">{o.userEmail}</td>
                                    <td>{o.quantity}</td>
                                    <td className="font-semibold">${o.totalPrice}</td>
                                    <td className="text-xs text-base-content/60">{new Date(o.orderedAt).toLocaleString()}</td>
                                    <td>
                                        <div className="flex gap-1">
                                            <button className="btn btn-ghost btn-xs text-success" onClick={() => handleApprove(o._id)}><FiCheck className="text-lg" /></button>
                                            <button className="btn btn-ghost btn-xs text-error" onClick={() => handleReject(o._id)}><FiX className="text-lg" /></button>
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

export default PendingOrders;
