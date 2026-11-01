export default function SpecialOffer() {
  return (
    <div className="special-offer-area">
      <div className="container">
        <div className="row">
          <div className="col-md-7 col-xs-12">
            <div className="special-offer">
              <div className="so-title">
                <span>hot offer</span>
                <h2>only two days!</h2>
              </div>
              <p className="so-text">Praesent nec finibus massa. Phasellus id auctor lacus, at iaculis lorem. Donec quis arcu elit. In vehicula purus sem, eu mattis est lacinia.</p>
              <h2 className="so-off-percent">-30% off</h2>
              <div className="timer-area">
                <div data-countdown="2017/7/30"></div>
              </div>
              <a className="so-view hvr-bs" href="#">view all products</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
