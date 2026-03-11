import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import { GiSewingMachine } from 'react-icons/gi';
import {
    FiHome, FiUsers, FiPackage, FiShoppingCart, FiPlusCircle,
    FiClipboard, FiCheckCircle, FiUser, FiMenu, FiX, FiBarChart2,
    FiTruck, FiSun, FiMoon
} from 'react-icons/fi';

const DashboardLayout = () => {
    const { user } = useAuth();
    const { role } = useRole();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('stitchtrack-theme') === 'stitchdark';
    });

    useEffect(() => {
        const theme = isDark ? 'stitchdark' : 'stitchlight';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('stitchtrack-theme', theme);
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark(prev => !prev);
    };

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
            <aside className={`fixed lg:sticky top-0 h-screen inset-y-0 left-0 z-50 w-72 bg-base-100 border-r border-base-300 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
                <header className="sticky top-0 z-30 bg-base-100/95 backdrop-blur shadow-sm border-b border-base-300 px-4 py-3 flex items-center justify-between lg:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            className="btn btn-ghost btn-circle btn-sm lg:hidden focus:outline-none"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            {sidebarOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
                        </button>

                        {/* Mobile Logo */}
                        <Link to="/" className="flex items-center gap-2 lg:hidden">
                            <GiSewingMachine className="text-2xl text-primary" />
                            <span className="text-lg font-bold text-base-content tracking-tight">StitchTrack</span>
                        </Link>
                    </div>

                    <div className="flex-1" />

                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="btn btn-ghost btn-circle btn-sm focus:outline-none"
                            aria-label="Toggle theme"
                        >
                            {isDark ? <FiSun className="w-5 h-5 hover:text-primary transition-colors" /> : <FiMoon className="w-5 h-5 hover:text-primary transition-colors" />}
                        </button>
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
