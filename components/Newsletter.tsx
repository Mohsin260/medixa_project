export default function Newsletter() {
  return (
    <div className="newsletter-area">
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-md-offset-3 col-xs-12">
            <div className="newsletter-content">
              <h2>Get Exclusive Offers & Updates</h2>
              <p>Subscribe for exclusive early access and new collection drops.</p>
              <div className="newsletter-form">
                <form action="#">
                  <input type="email" placeholder="Enter your mail" name="EMAIL" />
                  {" "}
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
