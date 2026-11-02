export default function Newsletter() {
  return (
    <div className="newsletter-area">
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-md-offset-3 col-xs-12">
            <div className="newsletter-content">
              <h2>Healthcare Heroes Circle</h2>
              <p>Subscribe for priority access to new scrub color drops, sizing restocks, and exclusive hospital team discounts.</p>
              <div className="newsletter-form">
                <form action="#" onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to Medixa Healthcare Circle!'); }}>
                  <input type="email" placeholder="Enter your email address…" name="EMAIL" required />
                  {' '}
                  <input className="hvr-bs" type="submit" value="Subscribe" name="subscribe" />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
