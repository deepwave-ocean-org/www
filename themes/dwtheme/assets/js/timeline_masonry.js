init_masonry = function () {
    console.log('init_masonry');
    var grid = document.querySelector('.masonry-grid');
    var msnry = new Masonry(grid, {
        itemSelector: '.masonry-item',
        percentPosition: true,
        columnWidth: '.masonry-item',
        gutter: 24
    });
    function positionDots() {
        document.getElementById('center_line').style.opacity = '1';

        const items = document.querySelectorAll('.masonry-item');
        const centerX = grid.offsetWidth / 2;

        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            const dot = item.querySelector('.timeline-dot');
            
            // Determine if item is on left or right side of center
            const itemCenterX = rect.left + rect.width / 2;
            const isOnLeft = itemCenterX < centerX;
            if (isOnLeft) {
                // Item is on left, dot goes on right
                dot.style.right = 'calc(-2.5 * 4px - 2%)';
                dot.style.left = 'auto';
                dot.style.top = '24px';
                dot.style.opacity = '0'; // TODO disable for now
            } else {
                // Item is on right, dot goes on left
                dot.style.left = 'calc(-2.5 * 4px - 2%)';
                dot.style.right = 'auto';
                dot.style.top = '24px';
                dot.style.opacity = '0'; // TODO disable for now
            }
        });
    }
    positionDots();
    // Wait for images to load
    imagesLoaded(grid).on('always', function() {
        msnry.layout();
        setTimeout(positionDots, 500);
    });
    
    // Reposition dots on window resize
    window.addEventListener('resize', function () {
        setTimeout(positionDots, 500);
    });


    // Set up Intersection Observer for animations
    const cards = document.querySelectorAll('.timeline-card');

    // Add this class to make the animation work only when we add the visible class
    cards.forEach(card => {
        card.classList.add('animation-ready');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If card is in view
            if (entry.isIntersecting) {
                // Add the class that triggers animation
                entry.target.classList.add('visible');
                // Stop observing this card after it's been animated
                observer.unobserve(entry.target);
            }
        });
    }, {
        // Card is considered "in view" when it's 15% visible
        threshold: 0.15,
        // Start loading a bit before the card comes into view
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all cards
    cards.forEach(card => {
        observer.observe(card);
    });
}
document.addEventListener('DOMContentLoaded', function () {
    init_masonry();
}
);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // DOM already loaded (hx-boost case), run immediately
    setTimeout(init_masonry, 0);
}