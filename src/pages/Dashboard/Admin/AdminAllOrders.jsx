import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

const AdminAllOrders = () => {
    const axiosSecure = useAxiosSecure();
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');

    const { data: orders = [], isLoading } = useQuery({
        queryKey: ['admin-orders', statusFilter, search],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (statusFilter) params.append('status', statusFilter);
            if (search) params.append('search', search);
            const res = await axiosSecure.get(`/orders/all?${params.toString()}`);
            return res.data;
        }
    });

    const statusBadge = (status) => {
        const colors = { pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-error', cancelled: 'badge-ghost' };
        return <span className={`badge badge-sm ${colors[status] || 'badge-ghost'} capitalize`}>{status}</span>;
    };

    return (
        <div>
            <h1 className="text-2xl font-extrabold mb-6">All Orders</h1>

            <div className="flex flex-wrap gap-3 mb-6">
                <label className="input input-bordered input-sm flex items-center gap-2 flex-1 min-w-[200px]">
                    <FiSearch />
                    <input type="text" placeholder="Search product or email..." className="grow" value={search} onChange={(e) => setSearch(e.target.value)} />
                </label>
                <select className="select select-bordered select-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Product</th>
                                <th>Buyer</th>
                                <th>Qty</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Payment</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o, i) => (
                                <tr key={o._id}>
                                    <td>{i + 1}</td>
                                    <td className="font-medium text-sm">{o.productTitle}</td>
                                    <td className="text-sm">{o.userEmail}</td>
                                    <td>{o.quantity}</td>
                                    <td className="font-semibold">${o.totalPrice}</td>
                                    <td>{statusBadge(o.status)}</td>
                                    <td><span className={`badge badge-sm ${o.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'} capitalize`}>{o.paymentStatus || 'unpaid'}</span></td>
                                    <td className="text-xs text-base-content/60">{new Date(o.orderedAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminAllOrders;
