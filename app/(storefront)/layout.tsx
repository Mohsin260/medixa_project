import type { ReactNode } from 'react';
import CustomerConcierge from '@/components/CustomerConcierge';

const STOREFRONT_STYLESHEETS = [
  'https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700',
  'https://fonts.googleapis.com/css?family=Raleway:300,400,500,700',
  '/css/montserrat.css',
  '/css/raleway.css',
  '/css/bootstrap.min.css',
  '/css/font-awesome.min.css',
  '/css/owl.carousel.min.css',
  '/css/magnific-popup.css',
  '/css/animate.css',
  '/css/jquery.fancybox.min.css',
  '/css/meanmenu.css',
  '/css/nivo-slider.css',
  '/css/jquery-ui.css',
  '/css/typography.css',
  '/css/style.css',
  '/css/responsive.css',
];

export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {STOREFRONT_STYLESHEETS.map((href) => (
        <link key={href} rel="stylesheet" href={href} precedence="storefront" />
      ))}
      {children}
      <CustomerConcierge />
    </>
  );
}
