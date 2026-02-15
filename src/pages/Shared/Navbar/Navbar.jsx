import { Link, NavLink } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import { GiSewingMachine } from 'react-icons/gi';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { user, logOut } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('stitchtrack-theme') === 'stitchdark';
    });

    useEffect(() => {
        const theme = isDark ? 'stitchdark' : 'stitchlight';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('stitchtrack-theme', theme);
    }, [isDark]);

    const handleLogout = () => {
        logOut();
    };

    const toggleTheme = () => {
        setIsDark(prev => !prev);
    };

    const linkClass = ({ isActive }) =>
        `px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isActive ? 'text-primary font-bold' : 'text-base-content/70 hover:text-primary'}`;

    const navLinks = (
        <>
            <NavLink to="/" end className={linkClass}>Home</NavLink>
            <NavLink to="/all-products" className={linkClass}>All Products</NavLink>
            {!user && (
                <>
                    <NavLink to="/about" className={linkClass}>About Us</NavLink>
                    <NavLink to="/contact" className={linkClass}>Contact</NavLink>
                </>
            )}
            {user && (<NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
            )}
        </>
    );

    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-base-100/80 border-b border-base-300/50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2 group">
                        <GiSewingMachine className="text-3xl text-primary transition-transform group-hover:rotate-12" />
                        <span className="text-xl font-extrabold tracking-tight">
                            <span className="text-primary">Stitch</span>
                            <span className="text-base-content">Track</span>
                        </span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks}
                    </nav>
                    <div className="hidden md:flex items-center gap-3">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="btn btn-ghost btn-circle btn-sm"
                            aria-label="Toggle theme"
                        >
                            {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                        </button>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="dropdown dropdown-end">
                                    <div tabIndex={0} role="button" className="avatar btn btn-ghost btn-circle">
                                        <div className="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                                            <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'U'}&background=f59e0b&color=0f172a`} alt="avatar" />
                                        </div>
                                    </div>
                                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300 mt-2">
                                        <li className="menu-title px-4 py-2">
                                            <span className="text-sm font-semibold">{user.displayName}</span>
                                        </li>
                                        <li><Link to="/dashboard">Dashboard</Link></li>
                                        <li><Link to="/dashboard/profile">Profile</Link></li>
                                        <li><button onClick={handleLogout} className="text-error">Logout</button></li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
                                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile: Theme + Menu Button */}
                    <div className="flex md:hidden items-center gap-1">
                        <button
                            onClick={toggleTheme}
                            className="btn btn-ghost btn-circle btn-sm"
                            aria-label="Toggle theme"
                        >
                            {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(!menuOpen)}>
                            {menuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden pb-4 border-t border-base-300">
                        <nav className="flex flex-col gap-1 pt-3">
                            {navLinks}
                        </nav>
                        <div className="mt-3 flex flex-col gap-2">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-3 px-3 py-2">
                                        <div className="avatar">
                                            <div className="w-8 rounded-full">
                                                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'U'}&background=f59e0b&color=0f172a`} alt="avatar" />
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium">{user.displayName}</span>
                                    </div>
                                    <button onClick={handleLogout} className="btn btn-error btn-sm mx-3">Logout</button>
                                </>
                            ) : (
                                <div className="flex gap-2 px-3">
                                    <Link to="/login" className="btn btn-ghost btn-sm flex-1">Login</Link>
                                    <Link to="/register" className="btn btn-primary btn-sm flex-1">Register</Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;