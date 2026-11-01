'use client';

import Header from '@/components/Header';
import LegacyScripts from '@/components/LegacyScripts';
import HeroSlider from '@/components/HeroSlider';
import TopBanner from '@/components/TopBanner';
import FeaturedItems from '@/components/FeaturedItems';
import SpecialOffer from '@/components/SpecialOffer';
import TopSaleTrend from '@/components/TopSaleTrend';
import Banner2 from '@/components/Banner2';
import FeaturePost from '@/components/FeaturePost';
import Services from '@/components/Services';
import Newsletter from '@/components/Newsletter';
import Brands from '@/components/Brands';
import Footer from '@/components/Footer';
import NewsletterPopup from '@/components/NewsletterPopup';
import ProductModal from '@/components/ProductModal';

export default function Home() {
  return (
    <>
      <div id="preloader"></div>
      <LegacyScripts home />
      <Header />
      <HeroSlider />
      <TopBanner />
      <FeaturedItems />
      <SpecialOffer />
      <TopSaleTrend />
      <Banner2 />
      <FeaturePost />
      <Services />
      <Newsletter />
      <Brands />
      <Footer />
      <NewsletterPopup />
      <ProductModal />
    </>
  );
}
