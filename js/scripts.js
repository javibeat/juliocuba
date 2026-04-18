document.addEventListener("DOMContentLoaded", function () {

    // ---- Mobile menu ----
    var hamburger = document.getElementById("hamburger");
    var mobileMenu = document.getElementById("mobile-menu");
    var savedScrollY = 0;

    function openMenu() {
        savedScrollY = window.scrollY;
        hamburger.classList.add("open");
        mobileMenu.classList.add("open");
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.width = "100%";
        document.body.style.top = "-" + savedScrollY + "px";
    }

    function closeMenu() {
        hamburger.classList.remove("open");
        mobileMenu.classList.remove("open");
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
        document.body.style.top = "";
        window.scrollTo(0, savedScrollY);
    }

    if (hamburger && mobileMenu) {
        hamburger.addEventListener("click", function () {
            if (mobileMenu.classList.contains("open")) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        mobileMenu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                closeMenu();
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

    // ---- Lightbox ----
    var lightbox = document.getElementById("lightbox");
    var galleryItems = document.querySelectorAll(".gallery-item");

    if (lightbox && galleryItems.length > 0) {
        var lbImg = lightbox.querySelector(".lightbox__img");
        var lbClose = lightbox.querySelector(".lightbox__close");
        var lbPrev = lightbox.querySelector(".lightbox__nav--prev");
        var lbNext = lightbox.querySelector(".lightbox__nav--next");
        var lbCounter = lightbox.querySelector(".lightbox__counter");
        var lbIndex = 0;

        var gallerySrcs = [];
        var galleryAlts = [];
        galleryItems.forEach(function (item) {
            var img = item.querySelector("img");
            if (img) {
                gallerySrcs.push(img.src);
                galleryAlts.push(img.alt || "");
            }
        });

        function openLightbox(index) {
            lbIndex = index;
            lbImg.src = gallerySrcs[lbIndex];
            lbImg.alt = galleryAlts[lbIndex];
            lbCounter.textContent = (lbIndex + 1) + " / " + gallerySrcs.length;
            lightbox.style.display = "flex";
            requestAnimationFrame(function () {
                lightbox.classList.add("open");
            });
            document.body.style.overflow = "hidden";
        }

        function closeLightbox() {
            lightbox.classList.remove("open");
            document.body.style.overflow = "";
            lightbox.addEventListener("transitionend", function handler() {
                if (!lightbox.classList.contains("open")) {
                    lightbox.style.display = "none";
                }
                lightbox.removeEventListener("transitionend", handler);
            });
        }

        function nextLightbox() {
            openLightbox((lbIndex + 1) % gallerySrcs.length);
        }

        function prevLightbox() {
            openLightbox((lbIndex - 1 + gallerySrcs.length) % gallerySrcs.length);
        }

        galleryItems.forEach(function (item, i) {
            item.addEventListener("click", function () { openLightbox(i); });
        });

        lbClose.addEventListener("click", closeLightbox);
        lbPrev.addEventListener("click", prevLightbox);
        lbNext.addEventListener("click", nextLightbox);

        lightbox.addEventListener("click", function (e) {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener("keydown", function (e) {
            if (!lightbox.classList.contains("open")) return;
            if (e.key === "Escape") closeLightbox();
            else if (e.key === "ArrowRight") nextLightbox();
            else if (e.key === "ArrowLeft") prevLightbox();
        });
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
