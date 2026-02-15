import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import { GiSewingMachine } from 'react-icons/gi';
import {
    FiHome, FiUsers, FiPackage, FiShoppingCart, FiPlusCircle,
    FiClipboard, FiCheckCircle, FiUser, FiMenu, FiX, FiBarChart2,
    FiTruck
} from 'react-icons/fi';

const DashboardLayout = () => {
    const { user } = useAuth();
    const { role } = useRole();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const adminLinks = [
        { to: '/dashboard', label: 'Dashboard', icon: <FiHome />, end: true },
        { to: '/dashboard/manage-users', label: 'Manage Users', icon: <FiUsers /> },
        { to: '/dashboard/all-products', label: 'All Products', icon: <FiPackage /> },
        { to: '/dashboard/all-orders', label: 'All Orders', icon: <FiShoppingCart /> },
        { to: '/dashboard/analytics', label: 'Analytics', icon: <FiBarChart2 /> },
        { to: '/dashboard/profile', label: 'My Profile', icon: <FiUser /> },
    ];

    const managerLinks = [
        { to: '/dashboard', label: 'Dashboard', icon: <FiHome />, end: true },
        { to: '/dashboard/add-product', label: 'Add Product', icon: <FiPlusCircle /> },
        { to: '/dashboard/manage-products', label: 'Manage Products', icon: <FiPackage /> },
        { to: '/dashboard/pending-orders', label: 'Pending Orders', icon: <FiClipboard /> },
        { to: '/dashboard/approved-orders', label: 'Approved Orders', icon: <FiCheckCircle /> },
        { to: '/dashboard/order-log', label: 'Order Log', icon: <FiMenu /> },
        { to: '/dashboard/profile', label: 'My Profile', icon: <FiUser /> },
    ];

    const buyerLinks = [
        { to: '/dashboard', label: 'Dashboard', icon: <FiHome />, end: true },
        { to: '/dashboard/my-orders', label: 'My Orders', icon: <FiShoppingCart /> },
        { to: '/dashboard/profile', label: 'My Profile', icon: <FiUser /> },
    ];

    const links = role === 'admin' ? adminLinks : role === 'manager' ? managerLinks : buyerLinks;

    const linkClasses = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${isActive
            ? 'bg-primary text-primary-content shadow-md'
            : 'hover:bg-base-300 text-base-content'
        }`;

    return (
        <div className="min-h-screen flex bg-base-200">
            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-base-100 border-r border-base-300 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="p-6 border-b border-base-300">
                        <Link to="/" className="flex items-center gap-3">
                            <GiSewingMachine className="text-3xl text-primary" />
                            <span className="text-xl font-bold text-base-content">StitchTrack</span>
                        </Link>
                    </div>

                    {/* User Info */}
                    <div className="p-4 border-b border-base-300">
                        <div className="flex items-center gap-3">
                            <div className="avatar">
                                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'U'}&background=f59e0b&color=0f172a`} alt="avatar" />
                                </div>
                            </div>
                            <div>
                                <p className="font-semibold text-sm">{user?.displayName || 'User'}</p>
                                <p className="text-xs text-base-content/60 capitalize badge badge-sm badge-primary badge-outline">{role}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                className={linkClasses}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <span className="text-lg">{link.icon}</span>
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Back to Home */}
                    <div className="p-4 border-t border-base-300">
                        <Link to="/" className="btn btn-outline btn-sm w-full">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-base-100 border-b border-base-300 px-4 py-3 flex items-center justify-between lg:px-8">
                    <button
                        className="btn btn-ghost btn-sm lg:hidden"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
                    </button>
                    <div className="flex-1" />
                    <div className="flex items-center gap-2">
                        <label className="swap swap-rotate btn btn-ghost btn-circle btn-sm">
                            <input type="checkbox" className="theme-controller" value="stitchdark" />
                            <svg className="swap-on fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" /></svg>
                            <svg className="swap-off fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" /></svg>
                        </label>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
