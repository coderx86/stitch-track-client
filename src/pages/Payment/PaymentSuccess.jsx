import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { FiCheckCircle, FiPackage, FiHash } from 'react-icons/fi';

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
                    if (res.data.success) {
                        setPaymentInfo({
                            transactionId: res.data.transactionId
                        });
                    } else {
                        setError('Payment verification failed.');
                    }
                })
                .catch(err => {
                    console.error(err);
                    setError('Failed to verify payment.');
                })
                .finally(() => setLoading(false));
        } else {
            setError('No session ID found.');
            setLoading(false);
        }
    }, [sessionId, axiosSecure]);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <span className="loading loading-spinner loading-lg text-success"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-error mb-4">Error!</h2>
                <p className="text-base-content/60 mb-6">{error}</p>
                <Link to="/dashboard/my-orders" className="btn btn-primary">Go to Orders</Link>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto px-4 py-16 text-center">
            <div className="card bg-base-100 border border-success/30 shadow-xl rounded-2xl overflow-hidden">
                <div className="bg-success/10 p-8 flex justify-center">
                    <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center text-success text-4xl animate-bounce">
                        <FiCheckCircle />
                    </div>
                </div>
                
                <div className="card-body p-8 space-y-4">
                    <h2 className="text-3xl font-extrabold text-success">Payment Successful!</h2>
                    <p className="text-base-content/60">Thank you for your purchase. Your order is now confirmed.</p>

                    <div className="bg-base-200/50 rounded-xl p-4 text-left space-y-3 mt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold uppercase tracking-wider text-base-content/40">Transaction ID</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-mono bg-base-100 p-2 rounded border border-base-300">
                            <FiHash className="text-base-content/40" />
                            <span className="truncate">{paymentInfo?.transactionId}</span>
                        </div>
                    </div>

                    <div className="card-actions justify-center mt-6">
                        <Link to="/dashboard/my-orders" className="btn btn-primary w-full rounded-xl">View My Orders</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
