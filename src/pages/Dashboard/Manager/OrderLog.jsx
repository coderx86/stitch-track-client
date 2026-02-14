import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

const OrderLog = () => {
    const axiosSecure = useAxiosSecure();
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');

    const { data: orders = [], isLoading } = useQuery({
        queryKey: ['manager-orders', statusFilter, search],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (statusFilter) params.append('status', statusFilter);
            if (search) params.append('search', search);
            return (await axiosSecure.get(`/orders/manager/all?${params.toString()}`)).data;
        }
    });

    const statusBadge = (s) => {
        const colors = { pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-error', cancelled: 'badge-ghost', completed: 'badge-primary' };
        return <span className={`badge badge-sm ${colors[s] || 'badge-ghost'} capitalize`}>{s}</span>;
    };

    return (
        <div>
            <h1 className="text-2xl font-extrabold mb-6">Order Log</h1>
            <div className="flex flex-wrap gap-3 mb-6">
                <label className="input input-bordered input-sm flex items-center gap-2 flex-1 min-w-[200px]"><FiSearch /><input type="text" placeholder="Search..." className="grow" value={search} onChange={e => setSearch(e.target.value)} /></label>
                <select className="select select-bordered select-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="">All Statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="cancelled">Cancelled</option>
                </select>
            </div>
            {isLoading ? <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg text-primary"></span></div> : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead><tr><th>#</th><th>Product</th><th>Buyer</th><th>Total</th><th>Status</th><th>Payment</th></tr></thead>
                        <tbody>
                            {orders.map((o, i) => (
                                <tr key={o._id}>
                                    <td>{i + 1}</td><td className="font-medium">{o.productTitle}</td><td className="text-sm">{o.userEmail}</td><td className="font-bold">${o.totalPrice}</td><td>{statusBadge(o.status)}</td>
                                    <td><span className={`badge badge-sm ${o.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>{o.paymentStatus || 'unpaid'}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrderLog;
