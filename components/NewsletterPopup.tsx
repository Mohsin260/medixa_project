export default function NewsletterPopup() {
  return (
    <>
      <div id="wd1_nlpopup_overlay"></div>
      {" "}
      <div id="wd1_nlpopup" data-expires="30" data-delay="10">
        <a href="#closepopup" id="wd1_nlpopup_close">x</a>
        <h2>newsletter</h2>
        <p>Subscribe to the Motorvehikle mailing list to receive updates on new arrivals, special offers and other discount information.</p>
        <div className="popup-subscribe-box">
          <input type="email" />
          {" "}
          <input type="submit" value="submit" />
        </div>
        <div className="pupup-dont-show">
          <input type="checkbox" />
          {" "}
          <span>Don&apos;t show this popup again</span>
        </div>
      </div>
    </>
  );
}
