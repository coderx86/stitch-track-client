import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { FiTruck, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ApprovedOrders = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data = {}, isLoading } = useQuery({
        queryKey: ['approved-orders', page],
        queryFn: async () => {
            const res = await axiosSecure.get('/orders/approved');
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

    const trackingMutation = useMutation({
        mutationFn: async ({ orderId, update }) => axiosSecure.post(`/trackings/${orderId}`, update),
        onSuccess: () => {
            queryClient.invalidateQueries(['approved-orders']);
            Swal.fire({ icon: 'success', title: 'Tracking Updated!', timer: 1500, showConfirmButton: false });
        }
    });

    const handleAddTracking = async (orderId) => {
        let currentStatus = '';
        try {
            const { data } = await axiosSecure.get(`/trackings/${orderId}`);
            if (data.updates && data.updates.length > 0) {
                currentStatus = data.updates[data.updates.length - 1].status;
            }
        } catch (error) {
            console.error("Failed to fetch tracking", error);
        }

        const stages = ['Cutting', 'Sewing', 'Finishing', 'Quality Check', 'Packing', 'Shipped', 'Delivered'];
        const options = stages.map(s => 
            `<option value="${s}" ${s === currentStatus ? 'selected' : ''}>${s}</option>`
        ).join('');

        const { value: formValues } = await Swal.fire({
            title: 'Add Tracking Update',
            html:
                `<div class="mb-4 text-sm text-base-content/70">Current Status: <span class="font-bold text-primary">${currentStatus || 'Not Started'}</span></div>` +
                '<select id="swal-stage" class="swal2-select">' +
                `<option value="" disabled ${!currentStatus ? 'selected' : ''}>Select New Status</option>` +
                options +
                '</select>' +
                '<input id="swal-note" class="swal2-input" placeholder="Notes (optional)">',
            showCancelButton: true,
            preConfirm: () => {
                const status = document.getElementById('swal-stage').value;
                if (!status) Swal.showValidationMessage('Please select a status');
                return {
                    status: status,
                    note: document.getElementById('swal-note').value,
                    timestamp: new Date()
                };
            }
        });

        if (formValues) {
            trackingMutation.mutate({ orderId, update: formValues });
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-extrabold mb-6">Approved Orders</h1>

            {isLoading ? (
                <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 text-base-content/50"><p className="text-lg">No approved orders</p></div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr><th>#</th><th>Product</th><th>Buyer</th><th>Qty</th><th>Total</th><th>Date</th><th>Track</th></tr>
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
                                        <button className="btn btn-ghost btn-xs text-info" onClick={() => handleAddTracking(o._id)}>
                                            <FiTruck className="text-lg" />
                                        </button>
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

export default ApprovedOrders;
