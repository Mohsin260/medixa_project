export default function HeroSlider() {
  return (
    <div className="home1-slider-container">
      <div id="home1_slider" className="nivoSlider slider-image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/slider/slider1.jpg" alt="Medical Scrubs Pakistan" title="#htmlcaption1" />
        {' '}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/slider/slider2.jpg" alt="Premium Medical Apparel" title="#htmlcaption2" />
      </div>
      {' '}
      <div id="htmlcaption1" className="nivo-html-caption slider-caption-1">
        <div className="slider-progress"></div>
        <div className="container">
          <div className="row">
            <div className="col-md-7 col-md-offset-1 col-sm-10 col-sm-offset-1">
              <div className="slide1-text">
                <div className="middle-text">
                  <div className="cap-dec animated bounceIn">
                    <h3>Medical Scrubs</h3>
                  </div>
                  <div className="cap-title animated zoomIn">
                    <h2>
                      for WOMEN & MEN
                      {' '}
                      <span>2026</span>
                    </h2>
                  </div>
                  <div className="cap-details animated bounceInRight">
                    <p>Shop export-quality scrubs for doctors, students, and hospital heroes. Long-lasting colors and full-day comfort with nationwide delivery across Pakistan.</p>
                  </div>
                  <div className="cap-readmore animated bounceInUp">
                    <a className="hvr-bs" href="/shop">View Collection</a>
                  </div>
                  <div className="cap-outer-text">
                    <p>
                      Medixa Medical
                      {' '}
                      <span>2026</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {' '}
      <div id="htmlcaption2" className="nivo-html-caption slider-caption-2">
        <div className="slider-progress"></div>
        <div className="container">
          <div className="row">
            <div className="col-md-7 col-md-offset-1 col-sm-10 col-sm-offset-1">
              <div className="slide1-text">
                <div className="middle-text">
                  <div className="cap-dec animated bounceIn">
                    <h3>Zero Fading Guarantee</h3>
                  </div>
                  <div className="cap-title animated zoomIn">
                    <h2>
                      Regal & Muse
                      {' '}
                      <span>Series</span>
                    </h2>
                  </div>
                  <div className="cap-details animated bounceInRight">
                    <p>Precision-engineered with 4-way stretch fabric and international vat dyeing. Designed to endure tough hospital shifts and repeated autoclaves.</p>
                  </div>
                  <div className="cap-readmore animated bounceInUp">
                    <a className="hvr-bs" href="/shop?category=Women">Shop Women&apos;s Scrubs</a>
                  </div>
                  <div className="cap-outer-text">
                    <p>
                      Pakistan Apparel
                      {' '}
                      <span>2026</span>
                    </p>
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
