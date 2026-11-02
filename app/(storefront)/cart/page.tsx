import CartPageContent from '@/components/CartPageContent';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LegacyScripts from '@/components/LegacyScripts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopping Cart | Medixa',
  description: 'Review your selected scrubs and proceed to checkout.',
};

export default function CartPage() {
  return (
    <>
      <div id="preloader" />
      <LegacyScripts />
      <Header />
      <CartPageContent />
      <Footer />
    </>
  );
}
