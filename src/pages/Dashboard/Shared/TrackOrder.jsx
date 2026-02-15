import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams, Link } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FiArrowLeft, FiTruck } from 'react-icons/fi';

const TrackOrder = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();

    const { data: tracking = { updates: [] }, isLoading } = useQuery({
        queryKey: ['tracking', id],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/trackings/${id}`);
            return data;
        }
    });

    // Helper to format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    if (isLoading) {
        return <div className="flex justify-center py-20"><span className="loading loading-spinner text-primary"></span></div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="flex items-center gap-4 mb-8">
                <Link to="/dashboard/my-orders" className="btn btn-circle btn-ghost">
                    <FiArrowLeft className="text-xl" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <FiTruck className="text-primary" /> Track Order
                    </h1>
                    <p className="text-xs text-base-content/60">Order ID: {id}</p>
                </div>
            </div>

            {tracking.updates && tracking.updates.length > 0 ? (
                <div className="card bg-base-100 shadow-xl border border-base-200 p-6">
                    <ul className="timeline timeline-vertical timeline-compact">
                        {tracking.updates.slice().reverse().map((update, index) => (
                            <li key={index}>
                                {index !== 0 && <hr className="bg-primary" />}
                                <div className="timeline-start text-xs text-base-content/50 w-24 text-right">
                                    {formatDate(update.dateTime)}
                                </div>
                                <div className="timeline-middle">
                                    <div className={`w-4 h-4 rounded-full ${index === 0 ? 'bg-primary ring-4 ring-primary/20' : 'bg-base-300'}`}></div>
                                </div>
                                <div className="timeline-end timeline-box bg-base-100 border-none shadow-none pl-2 pb-8">
                                    <p className="font-bold text-sm">{update.status}</p>
                                    <p className="text-xs text-base-content/70">{update.note}</p>
                                    {update.location && (
                                        <p className="text-xs text-base-content/50 mt-1">📍 {update.location}</p>
                                    )}
                                </div>
                                {index !== tracking.updates.length - 1 && <hr className="bg-primary" />}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="text-center py-12 bg-base-200/30 rounded-xl border border-dashed border-base-300">
                    <p className="text-base-content/50">🎉 Order placed! Tracking updates will appear here soon.</p>
                </div>
            )}
        </div>
    );
};

export default TrackOrder;
