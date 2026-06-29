// image-loader.js — Progressive blur-up loader
document.addEventListener('DOMContentLoaded', function() {
    // Find all images with class "progressive-img"
    var images = document.querySelectorAll('.progressive-img');
    
    // Create a watcher
    var observer = new IntersectionObserver(function(entries, obs) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var img = entry.target;
                var bigImageSrc = img.getAttribute('data-src');
                
                if (!bigImageSrc) return;
                
                // Create a hidden image to load the big version
                var loader = new Image();
                loader.src = bigImageSrc;
                
                // When big image finishes downloading...
                loader.onload = function() {
                    img.src = bigImageSrc;           // Swap to big image
                    img.classList.add('loaded');     // Remove blur
                };
                
                // Stop watching this image
                obs.unobserve(img);
            }
        });
    }, { rootMargin: '100px' }); // Start loading 100px before it scrolls into view
    
    // Watch all images
    images.forEach(function(img) {
        observer.observe(img);
    });
});
