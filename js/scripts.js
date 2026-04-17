document.addEventListener("DOMContentLoaded", function () {

    // ---- Hamburger menu ----
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", function () {
            hamburger.classList.toggle("open");
            navLinks.classList.toggle("open");
        });

        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                hamburger.classList.remove("open");
                navLinks.classList.remove("open");
            });
        });
    }

    // ---- Nav background on scroll ----
    const nav = document.getElementById("nav");
    if (nav) {
        window.addEventListener("scroll", function () {
            nav.classList.toggle("scrolled", window.scrollY > 60);
        }, { passive: true });
    }

    // ---- Scroll reveal ----
    var reveals = document.querySelectorAll(".reveal");
    if (reveals.length > 0) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        reveals.forEach(function (el) {
            observer.observe(el);
        });
    }

    // ---- Active nav link on scroll ----
    var sections = document.querySelectorAll("section[id]");
    var navLinkEls = document.querySelectorAll(".nav__link");

    if (sections.length > 0 && navLinkEls.length > 0) {
        window.addEventListener("scroll", function () {
            var scrollY = window.scrollY + 120;
            sections.forEach(function (section) {
                var top = section.offsetTop;
                var height = section.offsetHeight;
                var id = section.getAttribute("id");
                if (scrollY >= top && scrollY < top + height) {
                    navLinkEls.forEach(function (link) {
                        link.classList.remove("active");
                        if (link.getAttribute("href") === "#" + id) {
                            link.classList.add("active");
                        }
                    });
                }
            });
        }, { passive: true });
    }

    // ---- Video slider (legacy pages) ----
    var slider = document.querySelector(".slider-content");
    var items = document.querySelectorAll(".slider-item");
    var prevButton = document.querySelector(".prev");
    var nextButton = document.querySelector(".next");

    if (slider && items.length && prevButton && nextButton) {
        var currentIndex = 0;
        var totalItems = items.length;

        function showSlide(index) {
            if (index >= totalItems) currentIndex = 0;
            else if (index < 0) currentIndex = totalItems - 1;
            else currentIndex = index;

            items.forEach(function (item) {
                var video = item.querySelector("video");
                if (video) video.pause();
            });

            slider.style.transform = "translateX(-" + (currentIndex * 100) + "%)";
        }

        prevButton.addEventListener("click", function () { showSlide(currentIndex - 1); });
        nextButton.addEventListener("click", function () { showSlide(currentIndex + 1); });

        document.addEventListener("keydown", function (e) {
            if (e.key === "ArrowLeft") showSlide(currentIndex - 1);
            else if (e.key === "ArrowRight") showSlide(currentIndex + 1);
        });

        var touchStartX = 0;
        slider.addEventListener("touchstart", function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        slider.addEventListener("touchend", function (e) {
            var diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                showSlide(currentIndex + (diff > 0 ? 1 : -1));
            }
        }, { passive: true });

        showSlide(currentIndex);
    }
});
