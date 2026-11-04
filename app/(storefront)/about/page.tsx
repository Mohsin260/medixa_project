import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'About Medixa Pakistan — Precision Medical Apparel',
  description:
    'Export-quality medical scrubs engineered specifically for doctors, nurses, and medical students across Pakistan.',
};

export default function AboutPage() {
  return (
    <>
      <Header />

      {/* Hero Header */}
      <div style={{ background: '#f5f6fa', padding: '60px 0 50px', borderBottom: '1px solid #e5ebf1' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-md-offset-2 col-xs-12 text-center">
              <span style={{ fontSize: 12, fontWeight: 800, color: '#052263', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                About Medixa Pakistan
              </span>
              <h1 style={{ fontSize: 36, fontWeight: 800, color: '#131b2e', margin: '10px 0 16px', lineHeight: 1.2 }}>
                Crafted for the People Who Care for Everyone Else.
              </h1>
              <p style={{ fontSize: 15, color: '#687786', lineHeight: 1.6, margin: 0 }}>
                We believe Pakistani healthcare heroes deserve world-class uniforms. We combine medical-grade textiles, ergonomic cuts, and international dyeing standards to produce scrubs that outlast the toughest hospital shifts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Narrative Section */}
      <div style={{ padding: '70px 0', background: '#ffffff' }}>
        <div className="container">
          <div className="row" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="col-md-6 col-xs-12" style={{ marginBottom: 30 }}>
              <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid #e7ecf0', boxShadow: '0 12px 36px rgba(19,27,46, 0.08)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/img/real-product-images/Forte/Forte-Naval-1.webp"
                  alt="Medixa Medical Scrubs"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </div>

            <div className="col-md-6 col-xs-12" style={{ marginBottom: 30 }}>
              <div style={{ paddingLeft: 15 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#052263', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Our Purpose
                </span>
                <h2 style={{ fontSize: 26, fontWeight: 800, color: '#131b2e', margin: '8px 0 16px' }}>
                  Why We Founded Medixa
                </h2>
                <p style={{ fontSize: 14, color: '#596979', lineHeight: 1.7, marginBottom: 16 }}>
                  For decades, doctors, residents, and healthcare practitioners across Pakistan had to choose between uncomfortable, stiff local scrubs that faded after three washes or overpriced imported alternatives with weeks of shipping delay.
                </p>
                <p style={{ fontSize: 14, color: '#596979', lineHeight: 1.7, marginBottom: 24 }}>
                  Medixa was launched to solve this gap once and for all: export-grade medical apparel proudly tailored in Pakistan, with 4-way mechanical stretch, ultra-durable international vat dyeing, and guaranteed zero fading.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                  <div style={{ background: '#f5f6fa', borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#052263' }}>100+</div>
                    <div style={{ fontSize: 12, color: '#687887', marginTop: 4 }}>Wash Fading Guarantee</div>
                  </div>
                  <div style={{ background: '#f5f6fa', borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#052263' }}>24 hrs</div>
                    <div style={{ fontSize: 12, color: '#687887', marginTop: 4 }}>All-Day Shift Comfort</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars Section */}
      <div style={{ padding: '70px 0', background: '#fafcfd', borderTop: '1px solid #edf1f5', borderBottom: '1px solid #edf1f5' }}>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 text-center" style={{ marginBottom: 40 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#052263', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Engineering Standard
              </span>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: '#131b2e', margin: '6px 0 0' }}>
                The Four Pillars of Medixa Scrubs
              </h2>
            </div>
          </div>

          <div className="row">
            {[
              {
                icon: '🎨',
                title: 'Zero-Fading Vat Dyeing',
                desc: 'Specialized color lock ensures your black, maroon, navy, and olive scrubs stay rich and deep after endless autoclaves and laundry cycles.',
              },
              {
                icon: '⚡',
                title: '4-Way Ergonomic Stretch',
                desc: 'Spandex-infused technical weave moves effortlessly with you during emergency procedures, clinical rounds, and long hours on your feet.',
              },
              {
                icon: '💧',
                title: 'Moisture-Wicking Tech',
                desc: 'Rapid evaporation technology draws sweat away from the body, keeping doctors and nurses cool in intense hospital environments.',
              },
              {
                icon: '🛡️',
                title: 'Antimicrobial & Anti-Odor',
                desc: 'Specialized finish repels odor-causing hospital bacteria, keeping scrubs fresh from morning ward rounds through evening night calls.',
              },
            ].map((pillar) => (
              <div key={pillar.title} className="col-md-3 col-sm-6 col-xs-12" style={{ marginBottom: 24 }}>
                <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e7ecf0', padding: '28px 22px', height: '100%' }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{pillar.icon}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#131b2e', margin: '0 0 10px' }}>{pillar.title}</h3>
                  <p style={{ fontSize: 13, color: '#687786', lineHeight: 1.6, margin: 0 }}>{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div style={{ padding: '60px 0', background: '#131b2e', color: '#ffffff', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 12px' }}>
            Elevate Your Clinical Practice Today
          </h2>
          <p style={{ fontSize: 14, color: '#ccd4e4', maxWidth: 500, margin: '0 auto 24px' }}>
            Browse our signature Regal, Muse, Forte, and Rebel scrub collections with nationwide delivery across Pakistan.
          </p>
          <Link
            href="/shop"
            style={{
              display: 'inline-block',
              background: '#052263',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: 14,
              padding: '14px 34px',
              borderRadius: 30,
              textDecoration: 'none',
              boxShadow: '0 6px 18px rgba(0, 0, 0, 0.2)',
            }}
          >
            Shop Scrub Collections
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}

