import { Link } from 'react-router';
import { FiXCircle } from 'react-icons/fi';

const PaymentFail = () => {
    return (
        <div className="max-w-md mx-auto px-4 py-16 text-center">
            <div className="card bg-base-100 border border-error/30 shadow-xl rounded-2xl overflow-hidden p-8">
                <div className="bg-error/10 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center text-error text-4xl mb-6 shadow-inner"><FiXCircle /></div>
                <h2 className="text-3xl font-extrabold text-error mb-2">Payment Failed</h2>
                <p className="text-base-content/60 mb-8">The payment process was cancelled or failed. Your card has not been charged.</p>
                <div className="flex flex-col gap-3">
                    <Link to="/dashboard/my-orders" className="btn btn-primary rounded-xl h-12">Try Again</Link>
                    <Link to="/dashboard/my-orders" className="btn btn-ghost btn-sm">Home</Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentFail;
