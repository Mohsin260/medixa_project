export default function Banner2() {
  return (
    <div className="banner2-area">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6 col-sm-6 col-xs-12">
            <div className="banner2-left">
              <div className="single-b2-item b2l-item1" style={{ position: 'relative', overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/img/banner-2/banner-big.jpg"
                  alt="Medixa Medical Apparel"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {' '}
                <span className="b2-item-discount">EXPORT QUALITY</span>
                {' '}
                <div className="b2-item-content2 text-white">
                  <h2 style={{ color: '#ffffff' }}>Medixa Scrub Suits</h2>
                  <p style={{ color: '#ffffff' }}>Engineered for 24-Hour Hospital Shifts</p>
                  <a href="/shop" style={{ color: '#ffffff' }}>SHOP NOW</a>
                </div>
              </div>
            </div>
          </div>
          {' '}
          <div className="col-md-6 col-sm-6 col-xs-12">
            <div className="banner2-right">
              <div className="row">
                <div className="col-md-6 col-xs-12">
                  <div className="single-b2-item b2r-item1" style={{ position: 'relative', overflow: 'hidden' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/img/banner-2/banner-s1.jpg"
                      alt="Instagram Medixa"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    {' '}
                    <div className="single-b2-item-content">
                      <span className="sb2ic-icon">
                        <i className="fa fa-instagram"></i>
                      </span>
                      <p>FOLLOW US ON INSTAGRAM</p>
                      <a className="hvr-bs" href="https://instagram.com/medixa.pk" target="_blank" rel="noopener noreferrer">@medixa.pk</a>
                    </div>
                  </div>
                </div>
                {' '}
                <div className="col-md-6 hidden-sm col-xs-12">
                  <div className="single-b2-item b2r-item2" style={{ position: 'relative', overflow: 'hidden' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/img/banner-2/banner-s2.jpg"
                      alt="Healthcare Heroes"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    {' '}
                    <div className="single-b2-item-content">
                      <span className="sb2ic-icon">
                        <i className="fa fa-instagram"></i>
                      </span>
                      <p>PAKISTAN HEALTHCARE HEROES</p>
                      <a className="hvr-bs" href="/shop">#medixascrubs</a>
                    </div>
                  </div>
                </div>
                {' '}
                <div className="col-md-6 hidden-sm col-xs-12">
                  <div className="single-b2-item b2r-item3" style={{ position: 'relative', overflow: 'hidden' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/img/banner-2/banner-s3.jpg"
                      alt="Hospital scrubs"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                </div>
                {' '}
                <div className="col-md-6 hidden-sm col-xs-12">
                  <div className="single-b2-item b2r-item4" style={{ position: 'relative', overflow: 'hidden' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/img/banner-2/banner-s4.jpg"
                      alt="Medical apparel"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
