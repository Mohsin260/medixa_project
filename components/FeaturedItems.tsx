/* eslint-disable @next/next/no-html-link-for-pages */
import { formatPrice, getProductBySlug } from '@/lib/products';
import ProductCardActions from '@/components/ProductCardActions';

const priceFor = (slug: string) => {
  const product = getProductBySlug(slug);
  return formatPrice(product?.price ?? 0);
};

export default function FeaturedItems() {
  return (
    <div className="featured-item-area">
      <div className="container">
        <div className="featured-item-head">
          <div className="row">
            <div className="col-md-5 col-sm-6 col-xs-12">
              <div className="featured-item-left">
                <div className="section-title">
                  <span>Medixa Apparel</span>
                  <h2>Featured Scrubs & Uniforms</h2>
                </div>
              </div>
            </div>
            {" "}
            <div className="col-md-7 col-sm-6 col-xs-12">
              <div className="feature-item-tab-control">
                <ul className="fi-tab">
                  <li className="active">
                    <a data-toggle="tab" href="#all">ALL</a>
                  </li>
                  {" "}
                  <li>
                    <a data-toggle="tab" href="#women">WOMEN&apos;S</a>
                  </li>
                  {" "}
                  <li>
                    <a data-toggle="tab" href="#men">MEN&apos;S</a>
                  </li>
                  {" "}
                  <li>
                    <a data-toggle="tab" href="#shoes">LAB COATS</a>
                  </li>
                  {" "}
                  <li>
                    <a data-toggle="tab" href="#accessories">COLLECTIONS</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="featured-items tab-content">
          <div id="all" className="tab-pane fade in active">
            <div className="featured-all">
              <div className="fi-row">
                <div className="row">
                  <div className="col-md-4 col-sm-6 col-xs-12">
                    <div className="single-featured-item">
                      <div className="sfi-img">
                        <a href="/products/regal-round-neck-male-medical-scrubs-pakistan">
                          <img src="/img/real-product-images/regal/regal-thumbnail.webp" alt="Regal Scrub Suits" />
                        </a>
                        {" "}
                        <div className="sfi-img-content">
                          <ProductCardActions slug="regal-round-neck-male-medical-scrubs-pakistan" />
                        </div>
                      </div>
                      <div className="sfi-content">
                        <div className="sfi-name-cat">
                          <a className="sfi-name" href="/products/regal-round-neck-male-medical-scrubs-pakistan">Regal Scrub Suits</a>
                          {" "}
                          <span className="sfi-cat">Male Scrubs</span>
                        </div>
                        <div className="sfi-price-rating">
                          <p className="sfi-price">
                            Price:
                            {" "}
                            <span>{priceFor('regal-round-neck-male-medical-scrubs-pakistan')}</span>
                          </p>
                          {" "}
                          <div className="rating">
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
                        </div>
                      </div>
                    </div>
                  </div>
                  {" "}
                  <div className="col-md-4 col-sm-6 col-xs-12">
                    <div className="single-featured-item">
                      <div className="sfi-img">
                        <a href="/products/muse-v-neck-female-medical-scrubs-pakistan">
                          <img src="/img/real-product-images/muse/muse-thumbnail.webp" alt="Muse Scrub Suits" />
                        </a>
                        {" "}
                        <div className="sfi-img-content">
                          <ProductCardActions slug="muse-v-neck-female-medical-scrubs-pakistan" />
                        </div>
                        {" "}
                        <div className="sfi-img-banner">
                          <span>SALE</span>
                        </div>
                      </div>
                      <div className="sfi-content">
                        <div className="sfi-name-cat">
                          <a className="sfi-name" href="/products/muse-v-neck-female-medical-scrubs-pakistan">Muse Scrub Suits</a>
                          {" "}
                          <span className="sfi-cat">Female Scrubs</span>
                        </div>
                        <div className="sfi-price-rating">
                          <p className="sfi-price">
                            Price:
                            {" "}
                            <span>{priceFor('muse-v-neck-female-medical-scrubs-pakistan')}</span>
                          </p>
                          {" "}
                          <div className="rating">
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
                        </div>
                      </div>
                    </div>
                  </div>
                  {" "}
                  <div className="col-md-4 col-sm-6 col-xs-12">
                    <div className="single-featured-item">
                      <div className="sfi-img">
                        <a href="/products/forte-v-neck-male-medical-scrubs-pakistan">
                          <img src="/img/real-product-images/Forte/Forte-thumbnail.webp" alt="Forte Scrub Suits" />
                        </a>
                        {" "}
                        <div className="sfi-img-content">
                          <ProductCardActions slug="forte-v-neck-male-medical-scrubs-pakistan" />
                        </div>
                        {" "}
                        <div className="sfi-img-banner new">
                          <span>SALE</span>
                        </div>
                      </div>
                      <div className="sfi-content">
                        <div className="sfi-name-cat">
                          <a className="sfi-name" href="/products/forte-v-neck-male-medical-scrubs-pakistan">Forte Scrub Suits</a>
                          {" "}
                          <span className="sfi-cat">Male Scrubs</span>
                        </div>
                        <div className="sfi-price-rating">
                          <p className="sfi-price">
                            Price:
                            {" "}
                            <span>{priceFor('forte-v-neck-male-medical-scrubs-pakistan')}</span>
                          </p>
                          {" "}
                          <div className="rating">
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="fi-row">
                <div className="row">
                  <div className="col-md-4 col-sm-6 col-xs-12">
                    <div className="single-featured-item">
                      <div className="sfi-img">
                        <a href="/products/rebel-collar-neck-female-medical-scrubs-pakistan">
                          <img src="/img/real-product-images/rebel/Rebel-thumbnail.webp" alt="Rebel Scrub Suits" />
                        </a>
                        {" "}
                        <div className="sfi-img-content">
                          <ProductCardActions slug="rebel-collar-neck-female-medical-scrubs-pakistan" />
                        </div>
                      </div>
                      <div className="sfi-content">
                        <div className="sfi-name-cat">
                          <a className="sfi-name" href="/products/rebel-collar-neck-female-medical-scrubs-pakistan">Rebel Scrub Suits</a>
                          {" "}
                          <span className="sfi-cat">Female Scrubs</span>
                        </div>
                        <div className="sfi-price-rating">
                          <p className="sfi-price">
                            Price:
                            {" "}
                            <span>{priceFor('rebel-collar-neck-female-medical-scrubs-pakistan')}</span>
                          </p>
                          {" "}
                          <div className="rating">
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
                        </div>
                      </div>
                    </div>
                  </div>
                  {" "}
                  <div className="col-md-4 col-sm-6 col-xs-12">
                    <div className="single-featured-item">
                      <div className="sfi-img">
                        <a href="/products/reine-dress-cj-2145">
                          <img src="/img/feature-item/feature5.jpg" alt="" />
                        </a>
                        {" "}
                        <div className="sfi-img-content">
                          <ProductCardActions slug="reine-dress-cj-2145" />
                        </div>
                      </div>
                      <div className="sfi-content">
                        <div className="sfi-name-cat">
                          <a className="sfi-name" href="/products/reine-dress-cj-2145">Reine Dress CJ 2145</a>
                          {" "}
                          <span className="sfi-cat">T-shirt</span>
                        </div>
                        <div className="sfi-price-rating">
                          <p className="sfi-price">
                            Price:
                            {" "}
                            <span>{priceFor('reine-dress-cj-2145')}</span>
                          </p>
                          {" "}
                          <div className="rating">
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
                        </div>
                      </div>
                    </div>
                  </div>
                  {" "}
                  <div className="col-md-4 col-sm-6 col-xs-12">
                    <div className="single-featured-item">
                      <div className="sfi-img">
                        <a href="/products/rififi-dress-cy-78795">
                          <img src="/img/feature-item/feature6.jpg" alt="" />
                        </a>
                        {" "}
                        <div className="sfi-img-content">
                          <ProductCardActions slug="rififi-dress-cy-78795" />
                        </div>
                      </div>
                      <div className="sfi-content">
                        <div className="sfi-name-cat">
                          <a className="sfi-name" href="/products/rififi-dress-cy-78795">Rififi Dress CY 78795</a>
                          {" "}
                          <span className="sfi-cat">T-shirt</span>
                        </div>
                        <div className="sfi-price-rating">
                          <p className="sfi-price">
                            Price:
                            {" "}
                            <span>{priceFor('rififi-dress-cy-78795')}</span>
                          </p>
                          {" "}
                          <div className="rating">
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="women" className="tab-pane fade">
            <div className="featured-all">
              <div className="fi-row">
                <div className="row">
                  <div className="col-md-4 col-xs-12">
                    <div className="single-featured-item">
                      <div className="sfi-img">
                        <a href="/products/rolls-dress-ck-2845">
                          <img src="/img/feature-item/feature2.jpg" alt="" />
                        </a>
                        {" "}
                        <div className="sfi-img-content">
                          <ProductCardActions slug="rolls-dress-ck-2845" />
                        </div>
                      </div>
                      <div className="sfi-content">
                        <div className="sfi-name-cat">
                          <a className="sfi-name" href="/products/rolls-dress-ck-2845">Rolls Dress CK 2845</a>
                          {" "}
                          <span className="sfi-cat">T-shirt</span>
                        </div>
                        <div className="sfi-price-rating">
                          <p className="sfi-price">
                            Price:
                            {" "}
                            <span>{priceFor('rolls-dress-ck-2845')}</span>
                          </p>
                          {" "}
                          <div className="rating">
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
                        </div>
                      </div>
                    </div>
                  </div>
                  {" "}
                  <div className="col-md-4 col-xs-12">
                    <div className="single-featured-item">
                      <div className="sfi-img">
                        <a href="/products/rififi-dress-cy-78795">
                          <img src="/img/feature-item/feature6.jpg" alt="" />
                        </a>
                        {" "}
                        <div className="sfi-img-content">
                          <ProductCardActions slug="rififi-dress-cy-78795" />
                        </div>
                      </div>
                      <div className="sfi-content">
                        <div className="sfi-name-cat">
                          <a className="sfi-name" href="/products/rififi-dress-cy-78795">Rififi Dress CY 78795</a>
                          {" "}
                          <span className="sfi-cat">T-shirt</span>
                        </div>
                        <div className="sfi-price-rating">
                          <p className="sfi-price">
                            Price:
                            {" "}
                            <span>{priceFor('rififi-dress-cy-78795')}</span>
                          </p>
                          {" "}
                          <div className="rating">
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {" "}
          <div id="men" className="tab-pane fade">
            <div className="featured-all">
              <div className="fi-row">
                <div className="row">
                  <div className="col-md-4 col-xs-12">
                    <div className="single-featured-item">
                      <div className="sfi-img">
                        <a href="/products/rolls-dress-ck-2845">
                          <img src="/img/feature-item/feature5.jpg" alt="" />
                        </a>
                        {" "}
                        <div className="sfi-img-content">
                          <ProductCardActions slug="rolls-dress-ck-2845" />
                        </div>
                      </div>
                      <div className="sfi-content">
                        <div className="sfi-name-cat">
                          <a className="sfi-name" href="/products/rolls-dress-ck-2845">Rolls Dress CK 2845</a>
                          {" "}
                          <span className="sfi-cat">T-shirt</span>
                        </div>
                        <div className="sfi-price-rating">
                          <p className="sfi-price">
                            Price:
                            {" "}
                            <span>{priceFor('rolls-dress-ck-2845')}</span>
                          </p>
                          {" "}
                          <div className="rating">
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
                        </div>
                      </div>
                    </div>
                  </div>
                  {" "}
                  <div className="col-md-4 col-xs-12">
                    <div className="single-featured-item">
                      <div className="sfi-img">
                        <a href="/products/reine-dress-cj-2145">
                          <img src="/img/feature-item/feature4.jpg" alt="" />
                        </a>
                        {" "}
                        <div className="sfi-img-content">
                          <ProductCardActions slug="reine-dress-cj-2145" />
                        </div>
                      </div>
                      <div className="sfi-content">
                        <div className="sfi-name-cat">
                          <a className="sfi-name" href="/products/reine-dress-cj-2145">Reine Dress CJ 2145</a>
                          {" "}
                          <span className="sfi-cat">T-shirt</span>
                        </div>
                        <div className="sfi-price-rating">
                          <p className="sfi-price">
                            Price:
                            {" "}
                            <span>{priceFor('reine-dress-cj-2145')}</span>
                          </p>
                          {" "}
                          <div className="rating">
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
                        </div>
                      </div>
                    </div>
                  </div>
                  {" "}
                  <div className="col-md-4 col-xs-12">
                    <div className="single-featured-item">
                      <div className="sfi-img">
                        <a href="/products/rififi-dress-cy-78795">
                          <img src="/img/feature-item/feature3.jpg" alt="" />
                        </a>
                        {" "}
                        <div className="sfi-img-content">
                          <ProductCardActions slug="rififi-dress-cy-78795" />
                        </div>
                      </div>
                      <div className="sfi-content">
                        <div className="sfi-name-cat">
                          <a className="sfi-name" href="/products/rififi-dress-cy-78795">Rififi Dress CY 78795</a>
                          {" "}
                          <span className="sfi-cat">T-shirt</span>
                        </div>
                        <div className="sfi-price-rating">
                          <p className="sfi-price">
                            Price:
                            {" "}
                            <span>{priceFor('rififi-dress-cy-78795')}</span>
                          </p>
                          {" "}
                          <div className="rating">
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {" "}
          <div id="shoes" className="tab-pane fade">
            <div className="featured-all">
              <div className="fi-row">
                <div className="row">
                  <div className="col-md-4 col-xs-12">
                    <div className="single-featured-item">
                      <div className="sfi-img">
                        <a href="/products/rolls-dress-ck-2845">
                          <img src="/img/feature-item/feature2.jpg" alt="" />
                        </a>
                        {" "}
                        <div className="sfi-img-content">
                          <ProductCardActions slug="rolls-dress-ck-2845" />
                        </div>
                      </div>
                      <div className="sfi-content">
                        <div className="sfi-name-cat">
                          <a className="sfi-name" href="/products/rolls-dress-ck-2845">Rolls Dress CK 2845</a>
                          {" "}
                          <span className="sfi-cat">T-shirt</span>
                        </div>
                        <div className="sfi-price-rating">
                          <p className="sfi-price">
                            Price:
                            {" "}
                            <span>{priceFor('rolls-dress-ck-2845')}</span>
                          </p>
                          {" "}
                          <div className="rating">
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
                        </div>
                      </div>
                    </div>
                  </div>
                  {" "}
                  <div className="col-md-4 col-xs-12">
                    <div className="single-featured-item">
                      <div className="sfi-img">
                        <a href="/products/reine-dress-cj-2145">
                          <img src="/img/feature-item/feature1.jpg" alt="" />
                        </a>
                        {" "}
                        <div className="sfi-img-content">
                          <ProductCardActions slug="reine-dress-cj-2145" />
                        </div>
                      </div>
                      <div className="sfi-content">
                        <div className="sfi-name-cat">
                          <a className="sfi-name" href="/products/reine-dress-cj-2145">Reine Dress CJ 2145</a>
                          {" "}
                          <span className="sfi-cat">T-shirt</span>
                        </div>
                        <div className="sfi-price-rating">
                          <p className="sfi-price">
                            Price:
                            {" "}
                            <span>{priceFor('reine-dress-cj-2145')}</span>
                          </p>
                          {" "}
                          <div className="rating">
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {" "}
          <div id="accessories" className="tab-pane fade">
            <div className="featured-all">
              <div className="fi-row">
                <div className="row">
                  <div className="col-md-4 col-xs-12">
                    <div className="single-featured-item">
                      <div className="sfi-img">
                        <a href="/products/rolls-dress-ck-2845">
                          <img src="/img/feature-item/feature5.jpg" alt="" />
                        </a>
                        {" "}
                        <div className="sfi-img-content">
                          <ProductCardActions slug="rolls-dress-ck-2845" />
                        </div>
                      </div>
                      <div className="sfi-content">
                        <div className="sfi-name-cat">
                          <a className="sfi-name" href="/products/rolls-dress-ck-2845">Rolls Dress CK 2845</a>
                          {" "}
                          <span className="sfi-cat">T-shirt</span>
                        </div>
                        <div className="sfi-price-rating">
                          <p className="sfi-price">
                            Price:
                            {" "}
                            <span>{priceFor('rolls-dress-ck-2845')}</span>
                          </p>
                          {" "}
                          <div className="rating">
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
                        </div>
                      </div>
                    </div>
                  </div>
                  {" "}
                  <div className="col-md-4 col-xs-12">
                    <div className="single-featured-item">
                      <div className="sfi-img">
                        <a href="/products/reine-dress-cj-2145">
                          <img src="/img/feature-item/feature4.jpg" alt="" />
                        </a>
                        {" "}
                        <div className="sfi-img-content">
                          <ProductCardActions slug="reine-dress-cj-2145" />
                        </div>
                      </div>
                      <div className="sfi-content">
                        <div className="sfi-name-cat">
                          <a className="sfi-name" href="/products/reine-dress-cj-2145">Reine Dress CJ 2145</a>
                          {" "}
                          <span className="sfi-cat">T-shirt</span>
                        </div>
                        <div className="sfi-price-rating">
                          <p className="sfi-price">
                            Price:
                            {" "}
                            <span>{priceFor('reine-dress-cj-2145')}</span>
                          </p>
                          {" "}
                          <div className="rating">
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
                        </div>
                      </div>
                    </div>
                  </div>
                  {" "}
                  <div className="col-md-4 col-xs-12">
                    <div className="single-featured-item">
                      <div className="sfi-img">
                        <a href="/products/rolls-dress-ck-2845">
                          <img src="/img/feature-item/feature3.jpg" alt="" />
                        </a>
                        {" "}
                        <div className="sfi-img-content">
                          <ProductCardActions slug="rolls-dress-ck-2845" />
                        </div>
                      </div>
                      <div className="sfi-content">
                        <div className="sfi-name-cat">
                          <a className="sfi-name" href="/products/rolls-dress-ck-2845">Rolls Dress CK 2845</a>
                          {" "}
                          <span className="sfi-cat">T-shirt</span>
                        </div>
                        <div className="sfi-price-rating">
                          <p className="sfi-price">
                            Price:
                            {" "}
                            <span>{priceFor('rolls-dress-ck-2845')}</span>
                          </p>
                          {" "}
                          <div className="rating">
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
