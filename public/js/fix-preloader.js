// Hide preloader safely without mutating React DOM tree
(function() {
  function hidePreloader() {
    var preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.style.display = 'none';
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      preloader.style.pointerEvents = 'none';
    }
  }
  
  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);
  }
  
  setTimeout(hidePreloader, 200);
  setTimeout(hidePreloader, 1000);
})();
