/* eslint-disable @next/next/no-html-link-for-pages */
export default function TopBanner() {
  return (
    <div className="top-banner-area">
      <div className="container">
        <div className="row">
          {/* Banner 1: Regal */}
          <div className="col-md-3 col-sm-6 col-xs-12">
            <div className="single-top-banner">
              <div className="stb-img">
                <a href="/products/regal-round-neck-male-medical-scrubs-pakistan">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/img/top-banner/banner1.jpg" alt="Regal Scrubs" />
                </a>
              </div>
              <div className="stb-content">
                <h4 className="stb-title2">Collection</h4>
                <h2 className="stb-title">Regal Men</h2>
                <p className="stb-text">Round-neck export scrub suits</p>
              </div>
            </div>
          </div>
          {' '}
          {/* Banner 2: Muse */}
          <div className="col-md-3 col-sm-6 col-xs-12">
            <div className="single-top-banner">
              <div className="stb-img">
                <a href="/products/muse-v-neck-female-medical-scrubs-pakistan">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/img/top-banner/banner2.jpg" alt="Muse Scrubs" />
                </a>
              </div>
              <div className="stb-content">
                <h4 className="stb-title2">Tailored</h4>
                <h2 className="stb-title">Muse Women</h2>
                <p className="stb-text">Modern feminine silhouette</p>
              </div>
            </div>
          </div>
          {' '}
          {/* Banner 3: Forte */}
          <div className="col-md-3 col-sm-6 col-xs-12">
            <div className="single-top-banner">
              <div className="stb-img">
                <a href="/products/forte-v-neck-male-medical-scrubs-pakistan">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/img/top-banner/banner3.jpg" alt="Forte V-Neck" />
                </a>
              </div>
              <div className="stb-content">
                <h4 className="stb-title2">Active</h4>
                <h2 className="stb-title">Forte V-Neck</h2>
                <p className="stb-text">Engineered stretch performance</p>
              </div>
            </div>
          </div>
          {' '}
          {/* Banner 4: Rebel */}
          <div className="col-md-3 col-sm-6 col-xs-12">
            <div className="single-top-banner">
              <div className="stb-img">
                <a href="/products/rebel-collar-neck-female-medical-scrubs-pakistan">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/img/top-banner/banner4.jpg" alt="Rebel Scrubs" />
                </a>
              </div>
              <div className="stb-content">
                <h4 className="stb-title2">Signature</h4>
                <h2 className="stb-title">Rebel Series</h2>
                <p className="stb-text">Contemporary utility & collar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
