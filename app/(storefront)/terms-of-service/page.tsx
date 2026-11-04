import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Terms of Service — Medixa Pakistan',
  description: 'Terms and conditions governing purchases and usage of Medixa Pakistan medical apparel.',
};

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <div style={{ background: '#f5f6fa', padding: '36px 0', borderBottom: '1px solid #e5ebf1' }}>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 text-center">
              <span style={{ fontSize: 11, fontWeight: 700, color: '#052263', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Legal & Governance
              </span>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#131b2e', margin: '6px 0 0' }}>
                Terms of Service
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '60px 0 90px', background: '#fafcfd' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-md-offset-2 col-xs-12">
              <div style={{ background: '#ffffff', borderRadius: 20, border: '1px solid #e7ecf0', padding: '40px 32px', lineHeight: 1.8, color: '#49606d' }}>
                <p style={{ fontSize: 13, color: '#7a8896', marginTop: 0 }}>Effective Date: November 2026</p>

                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#131b2e', marginTop: 16 }}>1. Overview & Agreement</h3>
                <p>
                  This website is operated by Medixa Pakistan. Throughout the site, the terms &ldquo;we&rdquo;, &ldquo;us&rdquo; and &ldquo;our&rdquo; refer to Medixa. By visiting our site or purchasing medical scrubs from us, you agree to be bound by these Terms of Service.
                </p>

                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#131b2e', marginTop: 24 }}>2. Medical Apparel Orders & Pricing</h3>
                <p>
                  All prices listed on Medixa.pk are in Pakistani Rupees (PKR) and are inclusive of standard applicable duties. We reserve the right to modify prices or adjust promotional discounts at any time without prior notice.
                </p>

                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#131b2e', marginTop: 24 }}>3. Accuracy of Billing & Account Information</h3>
                <p>
                  You agree to provide current, complete, and accurate purchase and account information for all orders. For Cash on Delivery (COD) orders, our dispatch team may contact you via WhatsApp or phone call to verify shipping details before dispatch.
                </p>

                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#131b2e', marginTop: 24 }}>4. Sizing & Colors</h3>
                <p>
                  We display the colors and fabric textures of our scrub suits (Regal, Muse, Forte, Rebel) as accurately as possible. Due to variations in device displays and camera lighting, minor tonal nuances may exist.
                </p>

                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#131b2e', marginTop: 24 }}>5. Governing Law</h3>
                <p>
                  These Terms of Service and any separate agreements shall be governed by and construed in accordance with the laws of the Islamic Republic of Pakistan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

