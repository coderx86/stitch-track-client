import HeroBanner from './HeroBanner';
import OurProducts from './OurProducts';
import HowItWorks from './HowItWorks';
import CustomerFeedback from './CustomerFeedback';
import WhyChooseUs from './WhyChooseUs';
import Newsletter from './Newsletter';
import StatsSection from './StatsSection';
import BlogPreview from './BlogPreview';
import FAQ from './FAQ';

const Home = () => {
    return (
        <div>
            <HeroBanner />
            <OurProducts />
            <StatsSection />
            <HowItWorks />
            <CustomerFeedback />
            <BlogPreview />
            <WhyChooseUs />
            <FAQ />
            <Newsletter />
        </div>
    );
};

export default Home;
