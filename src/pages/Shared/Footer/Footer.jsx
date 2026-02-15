import { Link } from 'react-router';
import { GiSewingMachine } from 'react-icons/gi';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
    return (
        <footer className="bg-base-200 text-base-content">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2">
                            <GiSewingMachine className="text-3xl text-primary" />
                            <span className="text-xl font-extrabold">
                                <span className="text-primary">Stitch</span>Track
                            </span>
                        </Link>
                        <p className="text-base-content/70 text-sm leading-relaxed">
                            Streamline your garment production workflow. Track orders, manage production stages, and ensure timely delivery with StitchTrack.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="btn btn-circle btn-sm btn-ghost hover:btn-primary"><FaFacebookF /></a>
                            <a href="#" className="btn btn-circle btn-sm btn-ghost hover:btn-primary"><FaXTwitter /></a>
                            <a href="#" className="btn btn-circle btn-sm btn-ghost hover:btn-primary"><FaInstagram /></a>
                            <a href="#" className="btn btn-circle btn-sm btn-ghost hover:btn-primary"><FaLinkedinIn /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="text-base-content/70 hover:text-primary transition-colors">Home</Link></li>
                            <li><Link to="/all-products" className="text-base-content/70 hover:text-primary transition-colors">All Products</Link></li>
                            <li><Link to="/about" className="text-base-content/70 hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="text-base-content/70 hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Services</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="text-base-content/70">Order Management</li>
                            <li className="text-base-content/70">Production Tracking</li>
                            <li className="text-base-content/70">Quality Control</li>
                            <li className="text-base-content/70">Delivery Logistics</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Contact Us</h3>
                        <ul className="space-y-2 text-sm text-base-content/70">
                            <li>📍 123 Garment District, Dhaka</li>
                            <li>📧 hello@stitchtrack.com</li>
                            <li>📞 +880 1234-567890</li>
                            <li>🕐 Mon - Sat: 9AM - 6PM</li>
                        </ul>
                    </div>
                </div>

                <div className="divider before:bg-base-content/20 after:bg-base-content/20 my-8"></div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-base-content/60">
                    <p>© {new Date().getFullYear()} StitchTrack. All rights reserved.</p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
