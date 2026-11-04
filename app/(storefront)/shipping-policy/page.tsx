import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Shipping Policy — Medixa Pakistan',
  description: 'Nationwide medical scrubs delivery across Pakistan via TCS, Leopards, and PostEx.',
};

export default function ShippingPolicyPage() {
  return (
    <>
      <Header />
      <div style={{ background: '#f5f6fa', padding: '36px 0', borderBottom: '1px solid #e5ebf1' }}>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 text-center">
              <span style={{ fontSize: 11, fontWeight: 700, color: '#052263', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Store Policies
              </span>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#131b2e', margin: '6px 0 0' }}>
                Shipping & Delivery Policy
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
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#131b2e', marginTop: 0 }}>1. Nationwide Coverage</h3>
                <p>
                  Medixa delivers medical scrubs, doctor coats, and hospital uniforms to all cities and districts across Pakistan, including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, Sialkot, and Hyderabad.
                </p>

                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#131b2e', marginTop: 28 }}>2. Delivery Timelines</h3>
                <p>
                  • <strong>Major Cities (Karachi, Lahore, Islamabad/Rawalpindi):</strong> 2 to 3 business days.<br />
                  • <strong>Other Regions & Distant Districts:</strong> 3 to 5 business days.<br />
                  Orders are processed and dispatched within 24 hours of confirmation.
                </p>

                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#131b2e', marginTop: 28 }}>3. Delivery Charges</h3>
                <p>
                  • Standard nationwide flat rate: <strong>Rs 250</strong>.<br />
                  • <strong>FREE SHIPPING:</strong> Applied automatically on all orders above <strong>Rs 10,000</strong>.
                </p>

                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#131b2e', marginTop: 28 }}>4. Order Tracking</h3>
                <p>
                  Once dispatched via our courier partners (TCS, Leopards, or PostEx), an SMS and email notification with your tracking ID (e.g. MX-123456) will be sent. You can also track your order status directly on our <a href="/track-order" style={{ color: '#052263', fontWeight: 700 }}>Track Order page</a>.
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

