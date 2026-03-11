import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const AdminAllOrders = () => {
    const axiosSecure = useAxiosSecure();
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data = {}, isLoading } = useQuery({
        queryKey: ['admin-orders', statusFilter, search, page],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (statusFilter) params.append('status', statusFilter);
            if (search) params.append('search', search);
            
            // Note: If backend doesn't support pagination, we fetch all and paginate frontend. 
            // We assume backend handles `page` and `limit`, or we paginate frontend.
            // Assuming frontend pagination for this implementation to keep it safe:
            const res = await axiosSecure.get(`/orders/all?${params.toString()}`);
            const allData = res.data;
            
            // Frontend pagination logic
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
            <h1 className="text-2xl font-extrabold mb-6">All Orders</h1>

            <div className="flex flex-wrap gap-3 mb-6">
                <label className="input input-bordered input-sm flex items-center gap-2 flex-1 min-w-[200px]">
                    <FiSearch />
                    <input type="text" placeholder="Search product or email..." className="grow" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
                </label>
                <select className="select select-bordered select-sm" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
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
                                    <td>{(page - 1) * limit + i + 1}</td>
                                    <td className="font-medium text-sm">{o.productTitle}</td>
                                    <td className="text-sm">{o.userEmail}</td>
                                    <td>{o.quantity}</td>
                                    <td className="font-semibold">${o.totalPrice}</td>
                                    <td>{statusBadge(o.status)}</td>
                                    <td><span className={`badge badge-sm font-medium py-3 px-3 capitalize ${o.paymentStatus === 'paid' ? 'bg-success/20 text-success border-success/20' : 'bg-warning/20 text-warning border-warning/20'} border`}>{o.paymentStatus || 'unpaid'}</span></td>
                                    <td className="text-xs text-base-content/60">{new Date(o.orderedAt).toLocaleString()}</td>
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

export default AdminAllOrders;
