export default function HeroSlider() {
  return (
    <div className="home1-slider-container">
      <div id="home1_slider" className="nivoSlider slider-image">
        <img src="/img/slider/slider1.jpg" alt="" title="#htmlcaption1" />
        {" "}
        <img src="/img/slider/slider2.jpg" alt="" title="#htmlcaption2" />
      </div>
      {" "}
      <div id="htmlcaption1" className="nivo-html-caption slider-caption-1">
        <div className="slider-progress"></div>
        <div className="container">
          <div className="row">
            <div className="col-md-7 col-md-offset-1 col-sm-10 col-sm-offset-1">
              <div className="slide1-text hidden-xs">
                <div className="middle-text">
                  <div className="cap-dec animated bounceIn">
                    <h3>Medical Scrubs</h3>
                  </div>
                  <div className="cap-title animated zoomIn">
                    <h2>
                      for WOMEN & MEN
                      {" "}
                      <span>2026</span>
                    </h2>
                  </div>
                  <div className="cap-details animated bounceInRight">
                    <p>{"Shop the best scrubs for doctors, students, and all the hospital staff. Long-lasting colors and full-day comfort. Nationwide delivery across Pakistan"}</p>
                  </div>
                  <div className="cap-readmore animated bounceInUp">
                    <a className="hvr-bs" href="#">View Collection</a>
                  </div>
                  <div className="cap-outer-text">
                    <p>
                      Uniform fashion
                      {" "}
                      <span>2026</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {" "}
      <div id="htmlcaption2" className="nivo-html-caption slider-caption-2">
        <div className="slider-progress"></div>
        <div className="container">
          <div className="row">
            <div className="col-md-7 col-md-offset-1 col-sm-10 col-sm-offset-1">
              <div className="slide1-text hidden-xs">
                <div className="middle-text">
                  <div className="cap-dec animated bounceIn">
                    <h3>Medical Scrubs</h3>
                  </div>
                  <div className="cap-title animated zoomIn">
                    <h2>
                      for WOMEN & MEN
                      {" "}
                      <span>2026</span>
                    </h2>
                  </div>
                  <div className="cap-details animated bounceInRight">
                    <p>{"Shop the best scrubs for doctors, students, and all the hospital staff. Long-lasting colors and full-day comfort. Nationwide delivery across Pakistan"}</p>
                  </div>
                  <div className="cap-readmore animated bounceInUp">
                    <a className="hvr-bs" href="#">View Collection</a>
                  </div>
                  <div className="cap-outer-text">
                    <p>
                      Uniform fashion
                      {" "}
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
