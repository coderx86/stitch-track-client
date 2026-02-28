import { motion } from 'framer-motion';
import { Link } from 'react-router';

const Section = ({ title, children }) => (
    <div className="mb-8">
        <h2 className="text-xl font-bold mb-3 text-primary">{title}</h2>
        <div className="text-base-content/70 text-sm leading-relaxed space-y-2">{children}</div>
    </div>
);

const Terms = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                <h1 className="text-4xl font-extrabold mb-2">Terms & <span className="text-primary">Conditions</span></h1>
                <p className="text-base-content/50 text-sm">Last updated: February 28, 2025</p>
            </motion.div>

            <div className="card bg-base-100 border border-base-300 p-8 rounded-2xl">
                <Section title="1. Acceptance of Terms">
                    <p>By accessing or using StitchTrack, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our platform.</p>
                </Section>

                <Section title="2. User Accounts & Roles">
                    <p>Users may register as a Buyer, Manager, or (by admin assignment) Admin. Manager accounts require admin approval before full access is granted. You are responsible for maintaining the confidentiality of your credentials.</p>
                </Section>

                <Section title="3. Orders & Payments">
                    <p>Orders placed are binding commitments. Cancellation is only permitted for pending orders. Pay-first orders are processed via Stripe and are non-refundable once production begins. Cash-on-delivery orders must be confirmed at delivery.</p>
                </Section>

                <Section title="4. Product Listings">
                    <p>Managers are responsible for accuracy of their product listings. StitchTrack is not liable for discrepancies between listed and delivered products. Minimum order quantities (MOQ) are enforced at checkout.</p>
                </Section>

                <Section title="5. Privacy & Data">
                    <p>We collect personal information necessary to operate the platform. We do not sell user data. Payment information is processed by Stripe and never stored on our servers. For full details, see our Privacy Policy.</p>
                </Section>

                <Section title="6. Prohibited Activities">
                    <p>You may not: use the platform for illegal activities, post false product information, attempt to bypass authentication, or harass other users. Violations may result in account suspension.</p>
                </Section>

                <Section title="7. Limitation of Liability">
                    <p>StitchTrack is provided "as is". We are not liable for production delays, product quality issues, or losses arising from use of the platform beyond what is required by applicable law.</p>
                </Section>

                <Section title="8. Changes to Terms">
                    <p>We may update these terms at any time. Continued use of the platform after changes constitutes acceptance. We will notify registered users of significant changes via email.</p>
                </Section>

                <Section title="9. Contact">
                    <p>For questions about these terms, contact us at: <a href="mailto:legal@stitchtrack.com" className="text-primary hover:underline">legal@stitchtrack.com</a></p>
                </Section>

                <div className="mt-8 pt-6 border-t border-base-200 flex gap-3">
                    <Link to="/contact" className="btn btn-primary btn-sm">Contact Us</Link>
                    <Link to="/" className="btn btn-ghost btn-sm">Back to Home</Link>
                </div>
            </div>
        </div>
    );
};

export default Terms;
