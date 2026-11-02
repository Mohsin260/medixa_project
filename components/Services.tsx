export default function Services() {
  return (
    <div className="service-area">
      <div className="container">
        <div className="row">
          <div className="col-md-4 col-sm-4 col-xs-12">
            <div className="single-service customer-service">
              <div className="single-service-icon">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/img/service/customer.png" alt="WhatsApp Support" />
              </div>
              <h4 className="ss-title">WHATSAPP CONCIERGE</h4>
              <p className="ss-desc">+92 343 511 4065 (Mon-Sat)</p>
            </div>
          </div>
          {' '}
          <div className="col-md-4 col-sm-4 col-xs-12">
            <div className="single-service customer-service">
              <div className="single-service-icon">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/img/service/money-back.png" alt="7-Day Exchange" />
              </div>
              <h4 className="ss-title">7-DAY HASSLE-FREE EXCHANGE</h4>
              <p className="ss-desc">Guaranteed Size & Color Replacement</p>
            </div>
          </div>
          {' '}
          <div className="col-md-4 col-sm-4 col-xs-12">
            <div className="single-service customer-service">
              <div className="single-service-icon">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/img/service/shipping.png" alt="Nationwide Delivery" />
              </div>
              <h4 className="ss-title">NATIONWIDE DELIVERY</h4>
              <p className="ss-desc">Free Delivery on orders over Rs 10,000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
