import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FiTruck } from 'react-icons/fi';

const ApprovedOrders = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const { data: orders = [], isLoading } = useQuery({
        queryKey: ['approved-orders'],
        queryFn: async () => (await axiosSecure.get('/orders/approved')).data
    });

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
            if (data.updates?.length > 0) currentStatus = data.updates[data.updates.length - 1].status;
        } catch (e) { /* ignore */ }

        const stages = ['Cutting', 'Sewing', 'Finishing', 'Quality Check', 'Packing', 'Shipped', 'Delivered'];
        const options = stages.map(s => `<option value="${s}" ${s === currentStatus ? 'selected' : ''}>${s}</option>`).join('');

        const { value: formValues } = await Swal.fire({
            title: 'Update Tracking',
            html: `<select id="swal-stage" class="swal2-select"><option value="" disabled>Next Stage</option>${options}</select><input id="swal-note" class="swal2-input" placeholder="Notes">`,
            showCancelButton: true,
            preConfirm: () => ({ status: document.getElementById('swal-stage').value, note: document.getElementById('swal-note').value, timestamp: new Date() })
        });

        if (formValues?.status) trackingMutation.mutate({ orderId, update: formValues });
    };

    return (
        <div>
            <h1 className="text-2xl font-extrabold mb-6">Approved Orders</h1>
            {isLoading ? <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg text-primary"></span></div> : orders.length === 0 ? <div className="text-center py-20 text-base-content/50">No approved orders</div> : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead><tr><th>#</th><th>Product</th><th>Buyer</th><th>Total</th><th>Actions</th></tr></thead>
                        <tbody>
                            {orders.map((o, i) => (
                                <tr key={o._id}>
                                    <td>{i + 1}</td><td className="font-medium">{o.productTitle}</td><td>{o.userEmail}</td><td className="font-bold">${o.totalPrice}</td>
                                    <td><button onClick={() => handleAddTracking(o._id)} className="btn btn-ghost btn-xs text-info"><FiTruck className="text-lg" /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ApprovedOrders;
