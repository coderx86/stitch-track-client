import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const faqs = [
    {
        q: 'How does StitchTrack work?',
        a: 'StitchTrack is a B2B garment tracking platform. Buyers browse products, place orders, and managers handle production tracking from cutting to shipping. Admins oversee the entire supply chain.'
    },
    {
        q: 'What is the minimum order quantity (MOQ)?',
        a: 'MOQ varies by product. Each product listing displays its minimum order quantity. You cannot place an order below the MOQ to ensure production efficiency.'
    },
    {
        q: 'How can I track my order?',
        a: 'Once logged in, go to Dashboard → My Orders, then click "Track" on any approved order. You\'ll see a real-time production timeline with stages like Cutting, Sewing, QC, and Shipping.'
    },
    {
        q: 'How do I become a Manager?',
        a: 'Register as a Manager. Your account will be pending until an Admin approves it. Once approved, you can list products, manage orders, and update tracking timelines.'
    },
    {
        q: 'What payment methods are supported?',
        a: 'We support Cash on Delivery (COD) and online payment via Stripe (card payments). Pay-first orders are automatically approved upon payment.'
    },
    {
        q: 'Can I cancel my order after placing it?',
        a: 'Yes, you can cancel a pending order from your Dashboard. Once a manager approves the order, cancellation is not available.'
    },
    {
        q: 'Is my payment information secure?',
        a: 'All payments are processed through Stripe, which is PCI-DSS compliant. We never store your card details on our servers.'
    },
    {
        q: 'How do I contact support?',
        a: 'Use the Contact page to submit a message. Our team responds within 24 business hours. For urgent issues, reach us at hello@stitchtrack.com.'
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section className="py-20 bg-base-200">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                    <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-3">FAQ</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold">Frequently Asked <span className="text-primary">Questions</span></h2>
                    <p className="text-base-content/60 mt-3 max-w-xl mx-auto">Everything you need to know about StitchTrack</p>
                </motion.div>

                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                            <div className="card bg-base-100 border border-base-300 overflow-hidden">
                                <button
                                    className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold hover:bg-base-200 transition-colors"
                                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                    aria-expanded={openIndex === i}
                                >
                                    <span className="pr-4">{faq.q}</span>
                                    <FiChevronDown className={`text-primary text-lg shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
                                </button>
                                {openIndex === i && (
                                    <div className="px-6 pb-4 text-base-content/70 text-sm leading-relaxed border-t border-base-200 pt-3">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
