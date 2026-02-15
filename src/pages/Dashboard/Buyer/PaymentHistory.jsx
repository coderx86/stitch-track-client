import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FiDollarSign, FiCalendar, FiHash } from 'react-icons/fi';

const PaymentHistory = () => {
    const axiosSecure = useAxiosSecure();

    const { data: payments = [], isLoading } = useQuery({
        queryKey: ['payment-history'],
        queryFn: async () => (await axiosSecure.get('/payments/history')).data
    });

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-extrabold mb-6">Payment History</h1>

            {isLoading ? (
                <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>
            ) : payments.length === 0 ? (
                <div className="text-center py-20 text-base-content/50 bg-base-100 rounded-2xl border border-dashed border-base-300">
                    <p className="text-lg">No payment records found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-sm border border-base-300">
                    <table className="table table-zebra w-full">
                        <thead className="bg-base-200/50 text-base-content/60">
                            <tr>
                                <th>#</th>
                                <th>Transaction ID</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((p, i) => (
                                <tr key={p._id}>
                                    <td>{i + 1}</td>
                                    <td>
                                        <div className="flex items-center gap-2 font-mono text-xs text-base-content/70">
                                            <FiHash className="text-base-content/20" /> {p.transactionId}
                                        </div>
                                    </td>
                                    <td className="font-bold text-primary flex items-center gap-1">
                                        <FiDollarSign className="text-xs" />{p.amount.toFixed(2)}
                                    </td>
                                    <td className="text-sm">
                                        <div className="flex items-center gap-2 text-base-content/60">
                                            <FiCalendar className="text-base-content/30" />
                                            {new Date(p.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-success badge-sm border-none bg-success/20 text-success capitalize">{p.status}</span>
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

export default PaymentHistory;
