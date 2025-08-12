
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Courses from '@/components/Courses';
import News from '@/components/News';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import CartButton from '@/components/CartButton';
import Hadith from '@/components/hadith';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <Courses />
      <News />
      <FAQ />
      <Hadith />
      <Footer />
      {/* <WhatsAppButton/> */}
    </div>
  );
};

export default Index;
