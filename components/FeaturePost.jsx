export default function FeaturePost() {
  return (
    <div className="feature-post-area">
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <div className="feature-post-head">
              <div className="section-title">
                <span>DANAY</span>
                <h2>Featured POST</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="feature-post-carousel owl-carousel">
            <div className="col-xs-12">
              <div className="single-feature-post">
                <div className="feature-post-img">
                  <a href="#">
                    <img src="/img/feature-post/feature1.jpg" alt="" />
                  </a>
                  {" "}
                  <div className="fp-cat">
                    <span>Category</span>
                  </div>
                </div>
                <div className="feature-post-content">
                  <a className="fp-title" href="#">Vestibulum nisi neque, iaculis sed tristique non, tempor sit amet</a>
                  <div className="fp-meta">
                    <span className="comment">
                      <i className="fa fa-comments"></i>
                      Comments: 5
                      {" "}
                    </span>
                    {" "}
                    <span className="date">
                      <i className="fa fa-clock-o"></i>
                      Date: 25 sep 2017
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {" "}
            <div className="col-xs-12">
              <div className="single-feature-post">
                <div className="feature-post-img">
                  <a href="#">
                    <img src="/img/feature-post/feature2.jpg" alt="" />
                  </a>
                  {" "}
                  <div className="fp-cat">
                    <span>Category</span>
                  </div>
                </div>
                <div className="feature-post-content">
                  <a className="fp-title" href="#">Vestibulum nisi neque, iaculis sed tristique non, tempor sit amet</a>
                  <div className="fp-meta">
                    <span className="comment">
                      <i className="fa fa-comments"></i>
                      Comments: 5
                      {" "}
                    </span>
                    {" "}
                    <span className="date">
                      <i className="fa fa-clock-o"></i>
                      Date: 25 sep 2017
                    </span>
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
