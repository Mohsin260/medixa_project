/* eslint-disable @next/next/no-html-link-for-pages */
import { formatPrice, getProductBySlug } from '@/lib/products';

const priceFor = (slug) => formatPrice(getProductBySlug(slug).price);
const compareAtFor = (slug) => formatPrice(getProductBySlug(slug).compareAt);

export default function TopSaleTrend() {
  return (
    <div className="top-sale-trend-area">
      <div className="container">
        <div className="row">
          <div className="col-md-4 col-sm-6 col-xs-12">
            <div className="top-sale-trend top-rated">
              <h4 className="tst-title">top rated</h4>
              <div className="single-tst">
                <div className="clearfix">
                  <div className="single-tst-img">
                    <a href="/products/rolls-dress-ck">
                      <img src="/img/top-sale-trend/top1.jpg" alt="" />
                    </a>
                  </div>
                  {" "}
                  <div className="single-tst-content">
                    <a className="tst-pro-name" href="/products/rolls-dress-ck">Rolls Dress CK</a>
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
                    <span className="tst-price">
                      <span className="tst-old-price">{compareAtFor('rolls-dress-ck')}</span>
                      {" "}
                      {priceFor('rolls-dress-ck')}
                    </span>
                    <div className="tst-likeshopview">
                      <ul className="clearfix">
                        <li>
                          <a href="#">
                            <i className="fa fa-heart-o"></i>
                          </a>
                        </li>
                        {" "}
                        <li>
                          <a href="#">
                            <i className="fa fa-shopping-bag"></i>
                          </a>
                        </li>
                        {" "}
                        <li>
                          <a href="#" data-toggle="modal" data-target="#myModal">
                            <i className="fa fa-eye"></i>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="single-tst">
                <div className="clearfix">
                  <div className="single-tst-img">
                    <a href="/products/untice-dress-ck">
                      <img src="/img/top-sale-trend/top2.jpg" alt="" />
                    </a>
                  </div>
                  {" "}
                  <div className="single-tst-content">
                    <a className="tst-pro-name" href="/products/untice-dress-ck">Untice Dress CK</a>
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
                    <span className="tst-price">{priceFor('untice-dress-ck')}</span>
                    <div className="tst-likeshopview">
                      <ul className="clearfix">
                        <li>
                          <a href="#">
                            <i className="fa fa-heart-o"></i>
                          </a>
                        </li>
                        {" "}
                        <li>
                          <a href="#">
                            <i className="fa fa-shopping-bag"></i>
                          </a>
                        </li>
                        {" "}
                        <li>
                          <a href="#" data-toggle="modal" data-target="#myModal">
                            <i className="fa fa-eye"></i>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {" "}
          <div className="col-md-4 col-sm-6 col-xs-12">
            <div className="top-sale-trend on-sale">
              <h4 className="tst-title">on sale</h4>
              <div className="single-tst">
                <div className="clearfix">
                  <div className="single-tst-img">
                    <a href="/products/sports-dress">
                      <img src="/img/top-sale-trend/sale1.jpg" alt="" />
                    </a>
                  </div>
                  {" "}
                  <div className="single-tst-content">
                    <a className="tst-pro-name" href="/products/sports-dress">Sports Dress</a>
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
                    <span className="tst-price">{priceFor('sports-dress')}</span>
                    <div className="tst-likeshopview">
                      <ul className="clearfix">
                        <li>
                          <a href="#">
                            <i className="fa fa-heart-o"></i>
                          </a>
                        </li>
                        {" "}
                        <li>
                          <a href="#">
                            <i className="fa fa-shopping-bag"></i>
                          </a>
                        </li>
                        {" "}
                        <li>
                          <a href="#" data-toggle="modal" data-target="#myModal">
                            <i className="fa fa-eye"></i>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="single-tst">
                <div className="clearfix">
                  <div className="single-tst-img">
                    <a href="/products/rolls-dress-ck-2845">
                      <img src="/img/top-sale-trend/sale2.jpg" alt="" />
                    </a>
                  </div>
                  {" "}
                  <div className="single-tst-content">
                    <a className="tst-pro-name" href="/products/rolls-dress-ck-2845">Rolls Dress CK 2845</a>
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
                    <span className="tst-price">{priceFor('rolls-dress-ck-2845')}</span>
                    <div className="tst-likeshopview">
                      <ul className="clearfix">
                        <li>
                          <a href="#">
                            <i className="fa fa-heart-o"></i>
                          </a>
                        </li>
                        {" "}
                        <li>
                          <a href="#">
                            <i className="fa fa-shopping-bag"></i>
                          </a>
                        </li>
                        {" "}
                        <li>
                          <a href="#" data-toggle="modal" data-target="#myModal">
                            <i className="fa fa-eye"></i>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {" "}
          <div className="col-md-4 col-sm-6 col-xs-12">
            <div className="top-sale-trend trending">
              <h4 className="tst-title">trending</h4>
              <div className="single-tst">
                <div className="clearfix">
                  <div className="single-tst-img">
                    <a href="/products/rolls-dress-ck-2845">
                      <img src="/img/top-sale-trend/trend1.jpg" alt="" />
                    </a>
                  </div>
                  {" "}
                  <div className="single-tst-content">
                    <a className="tst-pro-name" href="/products/rolls-dress-ck-2845">Rolls Dress CK 2845</a>
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
                    <span className="tst-price">
                      <span className="tst-old-price">{compareAtFor('rolls-dress-ck-2845')}</span>
                      {" "}
                      {priceFor('rolls-dress-ck-2845')}
                    </span>
                    <div className="tst-likeshopview">
                      <ul className="clearfix">
                        <li>
                          <a href="#">
                            <i className="fa fa-heart-o"></i>
                          </a>
                        </li>
                        {" "}
                        <li>
                          <a href="#">
                            <i className="fa fa-shopping-bag"></i>
                          </a>
                        </li>
                        {" "}
                        <li>
                          <a href="#" data-toggle="modal" data-target="#myModal">
                            <i className="fa fa-eye"></i>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="single-tst">
                <div className="clearfix">
                  <div className="single-tst-img">
                    <a href="/products/dollice-dress-ck">
                      <img src="/img/top-sale-trend/trend2.jpg" alt="" />
                    </a>
                  </div>
                  {" "}
                  <div className="single-tst-content">
                    <a className="tst-pro-name" href="/products/dollice-dress-ck">Dollice Dress CK</a>
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
                    <span className="tst-price">
                      <span className="tst-old-price">{compareAtFor('dollice-dress-ck')}</span>
                      {" "}
                      {priceFor('dollice-dress-ck')}
                    </span>
                    <div className="tst-likeshopview">
                      <ul className="clearfix">
                        <li>
                          <a href="#">
                            <i className="fa fa-heart-o"></i>
                          </a>
                        </li>
                        {" "}
                        <li>
                          <a href="#">
                            <i className="fa fa-shopping-bag"></i>
                          </a>
                        </li>
                        {" "}
                        <li>
                          <a href="#" data-toggle="modal" data-target="#myModal">
                            <i className="fa fa-eye"></i>
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
      </div>
    </div>
  );
}
