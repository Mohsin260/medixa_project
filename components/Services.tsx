export default function Services() {
  return (
    <div className="service-area">
      <div className="container">
        <div className="row">
          <div className="col-md-4 col-sm-4 col-xs-12">
            <div className="single-service customer-service">
              <div className="single-service-icon">
                <img src="/img/service/customer.png" alt="" />
              </div>
              <h4 className="ss-title">24/7 CUSTOMER SERVICE</h4>
              <p className="ss-desc">Service Support 24/7</p>
            </div>
          </div>
          {" "}
          <div className="col-md-4 col-sm-4 col-xs-12">
            <div className="single-service customer-service">
              <div className="single-service-icon">
                <img src="/img/service/money-back.png" alt="" />
              </div>
              <h4 className="ss-title">MONEY BACK GUARANTEE !</h4>
              <p className="ss-desc">100% Money Back - 30 Days</p>
            </div>
          </div>
          {" "}
          <div className="col-md-4 col-sm-4 col-xs-12">
            <div className="single-service customer-service">
              <div className="single-service-icon">
                <img src="/img/service/shipping.png" alt="" />
              </div>
              <h4 className="ss-title">FREE SHIPPING WORLDWIDE</h4>
              <p className="ss-desc">Free shipping worldwide</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
