export default function SpecialOffer() {
  return (
    <div
      className="special-offer-area"
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#f1f0f6',
        padding: 0,
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          minHeight: 520,
          width: '100%',
        }}
      >
        {/* Left Column: Entirely filled with light background & all text info */}
        <div
          style={{
            flex: '1 1 50%',
            minWidth: 320,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 40px',
            backgroundColor: '#f1f0f6',
          }}
        >
          <div
            className="special-offer"
            style={{
              maxWidth: 480,
              width: '100%',
              textAlign: 'center',
            }}
          >
            <div className="so-title" style={{ marginBottom: 30 }}>
              <span>Healthcare Privilege</span>
              <h2>Zero Fading Guaranteed</h2>
            </div>

            <p className="so-text">
              Precision-engineered medical apparel with 4-way stretch fabric and international vat
              dyeing. Designed for demanding 12-to-24-hour shifts with nationwide cash on delivery
              across Pakistan.
            </p>

            <h2 className="so-off-percent">Free Shipping Over Rs 10,000</h2>

            <div className="timer-area">
              <div data-countdown="2027/12/31"></div>
            </div>

            <a className="so-view hvr-bs" href="/shop">
              View All Medical Scrubs
            </a>
          </div>
        </div>

        {/* Right Column: Entirely filled with the image */}
        <div
          style={{
            flex: '1 1 50%',
            minWidth: 320,
            minHeight: 460,
            backgroundImage: 'url(/img/bg/offer-right-full.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
          }}
          aria-label="Medixa Scrub Suits Special Offer Banner"
        />
      </div>

      <style jsx global>{`
        .special-offer-area {
          background-color: #f1f0f6 !important;
          background-image: none !important;
          overflow: hidden !important;
          padding: 0 !important;
        }
        .special-offer {
          text-align: center !important;
        }
        .special-offer .so-title h2::after {
          background: #052263 none repeat scroll 0 0;
          bottom: -23px;
          content: "";
          height: 2px;
          left: 0;
          margin: auto;
          position: absolute;
          right: 0;
          width: 73px;
        }
        .special-offer .timer-area {
          margin-bottom: 35px !important;
          text-align: center !important;
        }
        .special-offer .timer-area .cdown {
          text-align: center !important;
          display: inline-block !important;
          width: 80px !important;
          height: 80px !important;
          margin: 0 4px !important;
          background: #ffffff !important;
          border: 2px solid #052263 !important;
          border-radius: 16px !important;
          box-shadow: 0 4px 12px rgba(5, 34, 99, 0.12) !important;
          vertical-align: middle !important;
        }
        .special-offer .timer-area .cdown span {
          color: #111827 !important;
          font-weight: 700 !important;
          font-size: 19px !important;
          display: block !important;
          text-align: center !important;
          margin: 15px auto 0 !important;
          line-height: 1.1 !important;
        }
        .special-offer .timer-area .cdown p {
          color: #6b7280 !important;
          font-size: 10px !important;
          font-weight: 600 !important;
          line-height: 12px !important;
          text-transform: uppercase !important;
          text-align: center !important;
          margin: 0 auto !important;
        }
        .special-offer .so-view {
          background: #052263 !important;
          border-radius: 10px !important;
          color: #ffffff !important;
          font-weight: 700 !important;
        }
        .special-offer .so-view:hover {
          background: #031849 !important;
          color: #ffffff !important;
        }
        @media only screen and (max-width: 991px) {
          .special-offer-area {
            padding: 45px 0 30px !important;
          }
          .special-offer .so-title h2 {
            font-size: 28px !important;
            line-height: 34px !important;
          }
          .special-offer .so-off-percent {
            font-size: 24px !important;
            line-height: 30px !important;
          }
          .special-offer .timer-area {
            display: flex !important;
            justify-content: center !important;
            gap: 6px !important;
            flex-wrap: wrap !important;
            margin-bottom: 25px !important;
          }
          .special-offer .timer-area .cdown {
            margin: 0 !important;
            width: 66px !important;
            height: 66px !important;
          }
          .special-offer .timer-area .cdown span {
            margin-top: 10px !important;
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
