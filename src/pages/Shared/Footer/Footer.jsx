import { Link } from 'react-router';

const Footer = () => {
    return (
        <footer className="bg-base-200 text-base-content">
            <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                <p>© {new Date().getFullYear()} StitchTrack. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
