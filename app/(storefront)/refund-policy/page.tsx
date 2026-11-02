import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Refund & Exchange Policy — Medixa Pakistan',
  description: '7-day hassle-free exchange and zero-fading guarantee on Medixa medical scrubs.',
};

export default function RefundPolicyPage() {
  return (
    <>
      <Header />
      <div style={{ background: '#f5faf7', padding: '36px 0', borderBottom: '1px solid #e5ede8' }}>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 text-center">
              <span style={{ fontSize: 11, fontWeight: 700, color: '#1f6b52', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Store Policies
              </span>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#173c35', margin: '6px 0 0' }}>
                Returns & Exchange Policy
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '60px 0 90px', background: '#fafcfb' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-md-offset-2 col-xs-12">
              <div style={{ background: '#ffffff', borderRadius: 20, border: '1px solid #e6ebe8', padding: '40px 32px', lineHeight: 1.8, color: '#496359' }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#173c35', marginTop: 0 }}>1. 7-Day Hassle-Free Exchange</h3>
                <p>
                  We understand that finding your perfect medical scrub fit is critical for 12+ hour hospital duty. If your scrub suit doesn&apos;t fit comfortably, you may request an exchange for another size or color within <strong>7 days</strong> of delivery.
                </p>

                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#173c35', marginTop: 28 }}>2. Zero Fading Guarantee</h3>
                <p>
                  Medixa stands behind the export dyeing quality of every garment. If your scrubs exhibit abnormal color fading or bleed under recommended washing conditions, we will replace your set free of charge.
                </p>

                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#173c35', marginTop: 28 }}>3. Exchange Conditions</h3>
                <p>
                  • Items must be unwashed, unworn (aside from initial fitting), and in original packaging with tags intact.<br />
                  • Custom institutional embroidery or name-engraved scrub suits are customized specifically and cannot be returned unless there is a manufacturer defect.
                </p>

                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#173c35', marginTop: 28 }}>4. How to Initiate an Exchange</h3>
                <p>
                  Contact our WhatsApp concierge at <a href="https://wa.me/923435114065" style={{ color: '#1f6b52', fontWeight: 700 }}>+92 343 511 4065</a> or email <a href="mailto:support@medixa.pk" style={{ color: '#1f6b52', fontWeight: 700 }}>support@medixa.pk</a> with your Order ID (MX-XXXXXX) and desired replacement size. Our team will arrange courier pickup from your address.
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

