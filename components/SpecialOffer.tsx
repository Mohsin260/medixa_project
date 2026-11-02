export default function SpecialOffer() {
  return (
    <div className="special-offer-area">
      <div className="container">
        <div className="row">
          <div className="col-md-7 col-xs-12">
            <div className="special-offer">
              <div className="so-title">
                <span>Healthcare Privilege</span>
                <h2>Zero Fading Guaranteed</h2>
              </div>
              <p className="so-text">
                Precision-engineered medical apparel with 4-way stretch fabric and international vat dyeing. Designed for demanding 12-to-24-hour shifts with nationwide cash on delivery across Pakistan.
              </p>
              <h2 className="so-off-percent">Free Shipping Over Rs 10,000</h2>
              <div className="timer-area">
                <div data-countdown="2027/12/31"></div>
              </div>
              <a className="so-view hvr-bs" href="/shop">View All Medical Scrubs</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
