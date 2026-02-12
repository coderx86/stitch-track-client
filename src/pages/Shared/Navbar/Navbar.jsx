import { Link, NavLink } from 'react-router';
import useAuth from '../../../hooks/useAuth';
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
        </>
    );

    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-base-100/80 border-b border-base-300/50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2 group">
                        <span className="text-xl font-extrabold tracking-tight">
                            <span className="text-primary">Stitch</span>
                            <span className="text-base-content">Track</span>
                        </span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks}
                    </nav>
                    <div className="flex items-center gap-2">
                        <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
                        <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
