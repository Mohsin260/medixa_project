export default function NewsletterPopup() {
  return (
    <>
      <div id="wd1_nlpopup_overlay"></div>
      {' '}
      <div id="wd1_nlpopup" data-expires="30" data-delay="10">
        <a href="#closepopup" id="wd1_nlpopup_close">x</a>
        <h2>MEDIXA CIRCLE</h2>
        <p>Subscribe to receive updates on new scrub arrivals, zero-fading color drops, and healthcare professional privileges.</p>
        <div className="popup-subscribe-box">
          <input type="email" placeholder="Enter your email…" />
          {' '}
          <input type="submit" value="Submit" />
        </div>
        <div className="pupup-dont-show">
          <input type="checkbox" id="nl_dont_show" />
          {' '}
          <label htmlFor="nl_dont_show" style={{ display: 'inline', fontWeight: 'normal', color: 'inherit' }}>Don&apos;t show this popup again</label>
        </div>
      </div>
    </>
  );
}
