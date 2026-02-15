import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FiDollarSign, FiPackage, FiCreditCard } from 'react-icons/fi';

const PaymentPage = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        axiosSecure.get(`/orders/${id}`)
            .then(res => {
                if (res.data.paymentStatus === 'paid') {
                    Swal.fire({ icon: 'info', title: 'Already Paid', text: 'This order is already paid.', timer: 2000, showConfirmButton: false });
                    navigate('/dashboard/my-orders');
                    return;
                }
                setOrder(res.data);
            })
            .catch(() => {
                Swal.fire({ icon: 'error', title: 'Order Not Found' });
                navigate('/dashboard/my-orders');
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handlePayment = async () => {
        setProcessing(true);
        try {
            const { data } = await axiosSecure.post('/create-checkout-session', { orderId: id });
            window.location.href = data.url;
        } catch (error) {
            console.error(error);
            Swal.fire({ icon: 'error', title: 'Payment Init Failed', text: error.response?.data?.message || 'Could not start payment session' });
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }
    if (!order) return null;

    return (
        <div className="max-w-md mx-auto px-4 py-16 text-center">
            <div className="card bg-base-100 border border-base-300 shadow-xl rounded-2xl overflow-hidden">
                <div className="bg-primary/10 p-6 flex justify-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary text-3xl">
                        <FiCreditCard />
                    </div>
                </div>
                
                <div className="card-body p-8">
                    <h2 className="text-2xl font-bold mb-2">Complete Payment</h2>
                    <p className="text-base-content/60 mb-6">You are about to pay for your order via Stripe securely.</p>

                    <div className="bg-base-200/50 rounded-xl p-4 mb-6 text-left space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-base-content/60 flex items-center gap-2"><FiPackage /> Product</span>
                            <span className="font-medium text-sm truncate max-w-[150px]">{order.productTitle}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-base-content/60 flex items-center gap-2"><FiDollarSign /> Amount</span>
                            <span className="font-bold text-lg text-primary">${order.totalPrice.toFixed(2)}</span>
                        </div>
                    </div>

                    <button 
                        onClick={handlePayment} 
                        disabled={processing}
                        className="btn btn-primary w-full rounded-xl text-base h-12"
                    >
                        {processing ? <><span className="loading loading-spinner loading-sm"></span> Redirecting…</> : 'Pay with Stripe'}
                    </button>
                    
                    <p className="text-xs text-base-content/40 mt-4">You will be redirected to Stripe's secure checkout page.</p>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
