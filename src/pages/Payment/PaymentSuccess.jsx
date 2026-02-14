import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { FiCheckCircle, FiHash } from 'react-icons/fi';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const axiosSecure = useAxiosSecure();
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (sessionId) {
            axiosSecure.patch(`/payment-success?session_id=${sessionId}`)
                .then(res => {
                    if (res.data.success) setPaymentInfo({ transactionId: res.data.transactionId });
                    else setError('Payment verification failed.');
                })
                .catch(() => setError('Failed to verify payment.'))
                .finally(() => setLoading(false));
        } else {
            setError('No session ID found.');
            setLoading(false);
        }
    }, [sessionId, axiosSecure]);

    if (loading) return <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-success"></span></div>;

    if (error) return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-error mb-4">Error!</h2>
            <p className="text-base-content/60 mb-6">{error}</p>
            <Link to="/dashboard/my-orders" className="btn btn-primary">Go to Orders</Link>
        </div>
    );

    return (
        <div className="max-w-md mx-auto px-4 py-16 text-center">
            <div className="card bg-base-100 border border-success/30 shadow-xl rounded-2xl overflow-hidden p-8">
                <div className="bg-success/10 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center text-success text-4xl mb-6 shadow-inner animate-pulse"><FiCheckCircle /></div>
                <h2 className="text-3xl font-extrabold text-success mb-2">Payment Successful!</h2>
                <p className="text-base-content/60 mb-6">Your order is now confirmed and being processed.</p>
                <div className="bg-base-200/50 rounded-xl p-4 text-left border border-base-300">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 mb-2 block">Transaction ID</span>
                    <div className="flex items-center gap-2 text-sm font-mono break-all bg-base-100 p-2 rounded"><FiHash className="text-base-content/20" /><span>{paymentInfo?.transactionId}</span></div>
                </div>
                <Link to="/dashboard/my-orders" className="btn btn-primary w-full mt-8 rounded-xl h-12">View My Orders</Link>
            </div>
        </div>
    );
};

export default PaymentSuccess;
