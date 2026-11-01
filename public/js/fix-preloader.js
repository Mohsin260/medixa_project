// Force remove preloader
(function() {
  function removePreloader() {
    var preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.style.display = 'none';
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      if (preloader.parentNode) {
        preloader.parentNode.removeChild(preloader);
      }
    }
  }
  
  if (document.readyState === 'complete') {
    removePreloader();
  } else {
    window.addEventListener('load', removePreloader);
  }
  
  setTimeout(removePreloader, 2000);
  setInterval(removePreloader, 1000);
})();
