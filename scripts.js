/**
 * Slider functionality for Julio Cuba promo page
 * Handles video/image carousel navigation
 */
document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector(".slider-content");
    const items = document.querySelectorAll(".slider-item");
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");

    // Exit if slider elements don't exist
    if (!slider || !items.length || !prevButton || !nextButton) {
        return;
    }

    let currentIndex = 0;
    const totalItems = items.length;

    /**
     * Shows the slide at the specified index
     * @param {number} index - The index of the slide to show
     */
    function showSlide(index) {
        if (index >= totalItems) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = totalItems - 1;
        } else {
            currentIndex = index;
        }

        // Pause all videos when changing slides
        items.forEach((item) => {
            const video = item.querySelector("video");
            if (video) {
                video.pause();
            }
        });

        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    // Event listeners for navigation buttons
    prevButton.addEventListener("click", () => {
        showSlide(currentIndex - 1);
    });

    nextButton.addEventListener("click", () => {
        showSlide(currentIndex + 1);
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
            showSlide(currentIndex - 1);
        } else if (e.key === "ArrowRight") {
            showSlide(currentIndex + 1);
        }
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left - go next
                showSlide(currentIndex + 1);
            } else {
                // Swiped right - go prev
                showSlide(currentIndex - 1);
            }
        }
    }

    // Initialize slider
    showSlide(currentIndex);
});
