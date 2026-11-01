import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LegacyScripts from '@/components/LegacyScripts';
import CartPageContent from '@/components/CartPageContent';

export const metadata = {
  title: 'Shopping Cart | Medixa',
  description: 'Review your selected scrubs and proceed to checkout.',
};

export default function CartPage() {
  return (
    <>
      <div id="preloader"></div>
      <LegacyScripts />
      <Header />
      <CartPageContent />
      <Footer />
    </>
  );
}
