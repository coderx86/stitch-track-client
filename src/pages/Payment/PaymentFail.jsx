import { Link } from 'react-router';
import { FiXCircle } from 'react-icons/fi';

const PaymentFail = () => {
    return (
        <div className="max-w-md mx-auto px-4 py-16 text-center">
            <div className="card bg-base-100 border border-error/30 shadow-xl rounded-2xl overflow-hidden">
                <div className="bg-error/10 p-8 flex justify-center">
                    <div className="w-20 h-20 bg-error/20 rounded-full flex items-center justify-center text-error text-4xl">
                        <FiXCircle />
                    </div>
                </div>
                
                <div className="card-body p-8 space-y-4">
                    <h2 className="text-3xl font-extrabold text-error">Payment Cancelled</h2>
                    <p className="text-base-content/60">Your payment process was cancelled or failed. Your card has not been charged.</p>

                    <div className="card-actions justify-center mt-6 flex gap-3">
                        <Link to="/dashboard/my-orders" className="btn btn-outline w-full rounded-xl">Back to Orders</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentFail;
