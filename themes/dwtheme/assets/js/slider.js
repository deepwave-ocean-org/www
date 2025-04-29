// assets/js/slider.js
document.addEventListener('DOMContentLoaded', function() {
    const sliderContainer = document.getElementById('slider-container');
    const sliderItems = document.querySelectorAll('.slider-item');
    const sliderDots = document.querySelectorAll('.slider-dot');
    const prevButton = document.getElementById('prev-slide');
    const nextButton = document.getElementById('next-slide');
    
    let currentIndex = 0;
    const itemCount = sliderItems.length;
    
    // Touch handling variables
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Auto slide function
    function autoSlide() {
      const nextIndex = (currentIndex + 1) % itemCount;
      moveToSlide(nextIndex);
    }
    
    // Move to specific slide
    function moveToSlide(index) {
        console.log('Moving to slide:', index);
      // Hide current slide
      sliderItems[currentIndex].classList.remove('opacity-100');
      sliderItems[currentIndex].classList.add('opacity-0');
      sliderDots[currentIndex].classList.remove('bg-white', 'w-3', 'h-3');
      sliderDots[currentIndex].classList.add('bg-gray-400', 'w-2', 'h-2');
      
      // Show new slide
      currentIndex = index;
      sliderItems[currentIndex].classList.remove('opacity-0');
      sliderItems[currentIndex].classList.add('opacity-100');
      sliderDots[currentIndex].classList.remove('bg-gray-400', 'w-2', 'h-2');
      sliderDots[currentIndex].classList.add('bg-white', 'w-3', 'h-3');
    }
    
    // Previous slide function
    function goToPrevSlide() {
      const prevIndex = (currentIndex - 1 + itemCount) % itemCount;
      moveToSlide(prevIndex);
    }
    
    // Next slide function
    function goToNextSlide() {
      const nextIndex = (currentIndex + 1) % itemCount;
      moveToSlide(nextIndex);
    }
    
    // Set up dot navigation
    sliderDots.forEach((dot, index) => {
      dot.addEventListener('click', () => moveToSlide(index));
    });
    
    // Set up arrow navigation
    prevButton.addEventListener('click', function(e) {
      e.preventDefault();
      goToPrevSlide();
      resetAutoSlideTimer();
    });
    
    nextButton.addEventListener('click', function(e) {
      e.preventDefault();
      goToNextSlide();
      resetAutoSlideTimer();
    });
    
    // Touch event handlers
    sliderContainer.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    sliderContainer.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleTouchSwipe();
      resetAutoSlideTimer();
    }, {passive: true});
    
    function handleTouchSwipe() {
      const touchDiff = touchStartX - touchEndX;
      
      // Detect if swipe was significant (more than 50px)
      if (Math.abs(touchDiff) > 50) {
        if (touchDiff > 0) {
          // Swipe left, go to next slide
          goToNextSlide();
        } else {
          // Swipe right, go to previous slide
          goToPrevSlide();
        }
      }
    }
    
    // Start auto sliding
    let slideInterval = setInterval(autoSlide, 5000);
    
    // Reset timer function
    function resetAutoSlideTimer() {
      clearInterval(slideInterval);
      slideInterval = setInterval(autoSlide, 5000);
    }
    
    // Pause auto slide on hover
    sliderContainer.addEventListener('mouseenter', () => {
      clearInterval(slideInterval);
    });
    
    sliderContainer.addEventListener('mouseleave', () => {
      slideInterval = setInterval(autoSlide, 5000);
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') {
        goToPrevSlide();
        resetAutoSlideTimer();
      } else if (e.key === 'ArrowRight') {
        goToNextSlide();
        resetAutoSlideTimer();
      }
    });
  });