'use client';

import { useEffect } from 'react';

const SCRIPTS = [
  '/js/jquery-3.2.0.min.js',
  '/js/owl.carousel.min.js',
  '/js/jquery.counterup.min.js',
  '/js/countdown.js',
  '/js/jquery.magnific-popup.min.js',
  '/js/jquery.fancybox.min.js',
  '/js/jquery.meanmenu.js',
  '/js/jquery.nivo.slider.pack.js',
  '/js/jquery.scrollUp.js',
  '/js/jquery.mixitup.min.js',
  '/js/jquery.waypoints.min.js',
  '/js/jquery-ui.js',
  '/js/bootstrap.min.js',
  '/js/theme.js',
  '/js/fix-preloader.js',
];

export default function LegacyScripts() {
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      for (const src of SCRIPTS) {
        if (cancelled) return;
        if (document.querySelector(`script[src="${src}"]`)) continue;
        await new Promise<void>((resolve) => {
          const script = document.createElement('script');
          script.src = src;
          script.async = false;
          script.onload = () => resolve();
          script.onerror = () => resolve();
          document.body.appendChild(script);
        });
      }

      const removePreloader = () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
          preloader.style.display = 'none';
          preloader.style.opacity = '0';
          preloader.style.visibility = 'hidden';
          preloader.style.pointerEvents = 'none';
        }
      };

      setTimeout(removePreloader, 500);
      setTimeout(removePreloader, 1000);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
