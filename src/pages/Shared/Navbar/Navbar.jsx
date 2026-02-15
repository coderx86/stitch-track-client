import { Link, NavLink } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import { GiSewingMachine } from 'react-icons/gi';
import { FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
    const { user, logOut } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const linkClass = ({ isActive }) =>
        `px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isActive ? 'text-primary font-bold' : 'text-base-content/70 hover:text-primary'}`;

    const navLinks = (
        <>
            <NavLink to="/" end className={linkClass}>Home</NavLink>
            <NavLink to="/all-products" className={linkClass}>All Products</NavLink>
            <NavLink to="/about" className={linkClass}>About Us</NavLink>
            <NavLink to="/contact" className={linkClass}>Contact</NavLink>
            {user && <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>}
        </>
    );

    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-base-100/80 border-b border-base-300/50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2 group">
                        <GiSewingMachine className="text-3xl text-primary transition-transform group-hover:rotate-12" />
                        <span className="text-xl font-extrabold tracking-tight">
                            <span className="text-primary">Stitch</span><span className="text-base-content">Track</span>
                        </span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-1">{navLinks}</nav>
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="avatar btn btn-ghost btn-circle">
                                    <div className="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1"><img src={user.photoURL} alt="avatar" /></div>
                                </div>
                                <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300 mt-2">
                                    <li className="menu-title px-4 py-2"><span className="text-sm font-semibold">{user.displayName}</span></li>
                                    <li><Link to="/dashboard">Dashboard</Link></li>
                                    <li><Link to="/dashboard/profile">Profile</Link></li>
                                    <li><button onClick={() => logOut()} className="text-error">Logout</button></li>
                                </ul>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="btn btn-ghost btn-sm text-xs font-bold uppercase tracking-wider">Login</Link>
                                <Link to="/register" className="btn btn-primary btn-sm px-6 rounded-lg text-xs font-bold uppercase tracking-wider">Join Now</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

