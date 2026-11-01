export default function ProductModal() {
  return (
    <div className="modal fade" id="myModal" role="dialog">
      <div className="modal-dialog product-modal">
        <div className="modal-content">
          <button type="button" className="close" data-dismiss="modal">×</button>
          <div className="row">
            <div className="col-md-6 col-sm-12 col-xs-12">
              <div className="product-tab-area">
                <div className="clearfix">
                  <div className="product-tab-content tab-content">
                    <div id="spro1" className="tab-pane fade in active">
                      <a href="/img/single-product/product-large1.jpg" data-fancybox="images">
                        {" "}
                        <i className="fa fa-search-plus"></i>
                        {" "}
                        <img src="/img/single-product/product-large1.jpg" alt="" />
                        {" "}
                      </a>
                    </div>
                    <div id="spro2" className="tab-pane fade">
                      <a href="/img/single-product/product-large2.jpg" data-fancybox="images">
                        {" "}
                        <i className="fa fa-search-plus"></i>
                        {" "}
                        <img src="/img/single-product/product-large2.jpg" alt="" />
                        {" "}
                      </a>
                    </div>
                    {" "}
                    <div id="spro3" className="tab-pane fade">
                      <a href="/img/single-product/product-large3.jpg" data-fancybox="images">
                        {" "}
                        <i className="fa fa-search-plus"></i>
                        {" "}
                        <img src="/img/single-product/product-large3.jpg" alt="" />
                        {" "}
                      </a>
                    </div>
                  </div>
                  {" "}
                  <div className="product-tab-menu">
                    <ul className="product-tab">
                      <li className="active">
                        <a data-toggle="tab" href="#spro1">
                          <img src="/img/single-product/product-small1.jpg" alt="" />
                        </a>
                      </li>
                      <li>
                        <a data-toggle="tab" href="#spro2">
                          <img src="/img/single-product/product-small2.jpg" alt="" />
                        </a>
                      </li>
                      <li>
                        <a data-toggle="tab" href="#spro3">
                          <img src="/img/single-product/product-small3.jpg" alt="" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {" "}
            <div className="col-md-6 col-sm-12 col-xs-12">
              <div className="single-product-description-area">
                <h2 className="spd-title">Turtle Neck Wool Sweater</h2>
                <div className="rating clearfix">
                  <div className="star star-on"></div>
                  {" "}
                  <div className="star star-on"></div>
                  {" "}
                  <div className="star star-on"></div>
                  {" "}
                  <div className="star star-on"></div>
                  {" "}
                  <div className="star star-half"></div>
                </div>
                <p className="spd-price">
                  $980.00
                  {" "}
                  <span className="spd-old-price">$1060.00</span>
                </p>
                <p className="spd-text">Cotton-blend fabric, with hood, concealed zip and snap button fastening, flap pockets, loops on the cuffs, inner lining.</p>
                <ul className="spd-list">
                  <li>Satisfaction 100% Guaranteed</li>
                  <li>Free shipping on orders over $99</li>
                  <li>14 day easy Return</li>
                </ul>
                <div className="spd-select-color">
                  <span>Select Color:</span>
                  {" "}
                  <ul>
                    <li>
                      <a className="red" href="#"></a>
                    </li>
                    {" "}
                    <li>
                      <a className="black" href="#"></a>
                    </li>
                    {" "}
                    <li>
                      <a className="blue" href="#"></a>
                    </li>
                    {" "}
                    <li>
                      <a className="green" href="#"></a>
                    </li>
                    {" "}
                    <li>
                      <a className="yellow" href="#"></a>
                    </li>
                  </ul>
                </div>
                <div className="spd-select-size">
                  <span>Select Size:</span>
                  {" "}
                  <ul>
                    <li>
                      <a href="#">s</a>
                    </li>
                    {" "}
                    <li>
                      <a href="#">m</a>
                    </li>
                    {" "}
                    <li>
                      <a href="#">l</a>
                    </li>
                    {" "}
                    <li>
                      <a href="#">xl</a>
                    </li>
                    {" "}
                    <li>
                      <a href="#">xxl</a>
                    </li>
                  </ul>
                </div>
                <div className="spd-add-cart">
                  <p className="quantity cart-plus-minus">
                    <input type="text" defaultValue="1" />
                  </p>
                  {" "}
                  <button className="spd-add-to hvr-bs">ADD TO CART</button>
                </div>
                <div className="spd-meta">
                  <div className="spd-meta-type">
                    <p>
                      SKU:
                      {" "}
                      <span>00012{" "}</span>
                    </p>
                  </div>
                  {" "}
                  <div className="spd-meta-cat">
                    <span>Categories:</span>
                    {" "}
                    <ul>
                      <li>
                        <a href="#">Men</a>
                      </li>
                      {" "}
                      <li>
                        <a href="#">T-Shirts</a>
                      </li>
                      {" "}
                      <li>
                        <a href="#">T-Shirts</a>
                      </li>
                    </ul>
                  </div>
                  {" "}
                  <div className="spd-meta-tags">
                    <span>Tags:</span>
                    {" "}
                    <ul>
                      <li>
                        <a href="#">man</a>
                      </li>
                      {" "}
                      <li>
                        <a href="#">t-shirt</a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="spd-share">
                  <span>Share Link:</span>
                  {" "}
                  <ul>
                    <li>
                      <a href="#">
                        <i className="fa fa-facebook"></i>
                      </a>
                    </li>
                    {" "}
                    <li>
                      <a href="#">
                        <i className="fa fa-twitter"></i>
                      </a>
                    </li>
                    {" "}
                    <li>
                      <a href="#">
                        <i className="fa fa-google-plus"></i>
                      </a>
                    </li>
                    {" "}
                    <li>
                      <a href="#">
                        <i className="fa fa-rss"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
