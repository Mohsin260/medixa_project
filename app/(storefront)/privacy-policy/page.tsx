import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy — Medixa Pakistan',
  description: 'How Medixa Pakistan protects customer privacy, order information, and personal data.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <div style={{ background: '#f5f6fa', padding: '36px 0', borderBottom: '1px solid #e5ebf1' }}>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 text-center">
              <span style={{ fontSize: 11, fontWeight: 700, color: '#052263', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Legal & Security
              </span>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#131b2e', margin: '6px 0 0' }}>
                Privacy Policy
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
                <p style={{ fontSize: 13, color: '#7a8896', marginTop: 0 }}>Last updated: November 2026</p>

                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#131b2e', marginTop: 16 }}>1. Information We Collect</h3>
                <p>
                  When you visit Medixa.pk or place an order for medical scrub suits, we collect essential information required to fulfill your order, including your full name, shipping address, city, phone number (for courier SMS updates), and email address.
                </p>

                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#131b2e', marginTop: 24 }}>2. How We Use Your Data</h3>
                <p>
                  • <strong>Order Fulfillment:</strong> Communicating dispatch tracking, verifying Cash on Delivery (COD) addresses, and dispatching parcels via our courier partners (TCS, Leopards, PostEx).<br />
                  • <strong>Customer Service:</strong> Providing WhatsApp support regarding size replacements or exchanges.<br />
                  • <strong>Security:</strong> Protecting against fraudulent transactions and verifying account sessions.
                </p>

                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#131b2e', marginTop: 24 }}>3. Sharing Information with Third Parties</h3>
                <p>
                  We never sell, rent, or trade your personal data. We only share necessary delivery information (name, address, contact number) with licensed logistics partners strictly for package delivery within Pakistan.
                </p>

                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#131b2e', marginTop: 24 }}>4. Data Protection & Security</h3>
                <p>
                  Medixa employs SSL encryption on all checkout transactions and password encryption using standard cryptographic hashing. No customer payment credentials or banking PINs are ever stored on our servers.
                </p>

                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#131b2e', marginTop: 24 }}>5. Inquiries & Contact</h3>
                <p>
                  For any privacy questions or requests to delete your account data, please email our data officer at <a href="mailto:info@medixa.pk" style={{ color: '#052263', fontWeight: 700 }}>info@medixa.pk</a> or contact our WhatsApp desk at <a href="tel:+923435114065" style={{ color: '#052263', fontWeight: 700 }}>+92 343 511 4065</a>.
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

