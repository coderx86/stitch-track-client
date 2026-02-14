import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FiCheck, FiX } from 'react-icons/fi';

const PendingOrders = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const { data: orders = [], isLoading } = useQuery({
        queryKey: ['pending-orders'],
        queryFn: async () => (await axiosSecure.get('/orders/pending')).data
    });

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
        Swal.fire({ title: 'Approve order?', icon: 'question', showCancelButton: true, confirmButtonText: 'Approve' }).then(r => r.isConfirmed && approveMutation.mutate(id));
    };

    const handleReject = (id) => {
        Swal.fire({ title: 'Reject order?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'Reject' }).then(r => r.isConfirmed && rejectMutation.mutate(id));
    };

    return (
        <div>
            <h1 className="text-2xl font-extrabold mb-6">Pending Orders</h1>
            {isLoading ? <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg text-primary"></span></div> : orders.length === 0 ? <div className="text-center py-20 text-base-content/50">No pending orders</div> : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead><tr><th>#</th><th>Product</th><th>Buyer</th><th>Qty</th><th>Total</th><th>Actions</th></tr></thead>
                        <tbody>
                            {orders.map((o, i) => (
                                <tr key={o._id}>
                                    <td>{i + 1}</td><td className="font-medium">{o.productTitle}</td><td className="text-sm">{o.userEmail}</td><td>{o.quantity}</td><td className="font-bold">${o.totalPrice}</td>
                                    <td><div className="flex gap-1"><button onClick={() => handleApprove(o._id)} className="btn btn-ghost btn-xs text-success"><FiCheck /></button><button onClick={() => handleReject(o._id)} className="btn btn-ghost btn-xs text-error"><FiX /></button></div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PendingOrders;
