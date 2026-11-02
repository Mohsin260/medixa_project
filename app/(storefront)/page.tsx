'use client';

import Banner2 from '@/components/Banner2';
import Brands from '@/components/Brands';
import FeaturedItems from '@/components/FeaturedItems';
import FeaturePost from '@/components/FeaturePost';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import LegacyScripts from '@/components/LegacyScripts';
import Newsletter from '@/components/Newsletter';
import NewsletterPopup from '@/components/NewsletterPopup';
import ProductModal from '@/components/ProductModal';
import Services from '@/components/Services';
import SpecialOffer from '@/components/SpecialOffer';
import TopBanner from '@/components/TopBanner';
import TopSaleTrend from '@/components/TopSaleTrend';

export default function Home() {
  return (
    <>
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
