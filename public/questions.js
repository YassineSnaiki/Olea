document.addEventListener("DOMContentLoaded", function() {
    const slides = document.querySelectorAll(".carousel-slide");
    const dots = document.querySelectorAll(".dot");
    let currentIndex = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add("active");
                setTimeout(() => {
                    const questionBox = slide.querySelector('.question-box');
                    const answerBox = slide.querySelector('.answer-box');
                    questionBox.style.opacity = '1';
                    questionBox.style.visibility = 'visible';
                    questionBox.style.transform = 'translateX(0)';
                    answerBox.style.opacity = '1';
                    answerBox.style.visibility = 'visible';
                    answerBox.style.transform = 'translateX(0)';
                }, 10); // Small delay to allow slide to become active before transition
            } else {
                slide.classList.remove("active");
                const questionBox = slide.querySelector('.question-box');
                const answerBox = slide.querySelector('.answer-box');
                questionBox.style.opacity = '0';
                questionBox.style.visibility = 'hidden';
                questionBox.style.transform = 'translateX(20px)';
                answerBox.style.opacity = '0';
                answerBox.style.visibility = 'hidden';
                answerBox.style.transform = 'translateX(-20px)';
            }
            dots[i].classList.toggle("active", i === index);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
        showSlide(currentIndex);
    }

    function resetSlideInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    document.querySelector(".arrow.left").addEventListener("click", () => {
        currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
        showSlide(currentIndex);
        resetSlideInterval();
    });

    document.querySelector(".arrow.right").addEventListener("click", () => {
        currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
        showSlide(currentIndex);
        resetSlideInterval();
    });

    dots.forEach(dot => {
        dot.addEventListener("click", (e) => {
            currentIndex = parseInt(e.target.getAttribute("data-slide"));
            showSlide(currentIndex);
            resetSlideInterval();
        });
    });

    showSlide(currentIndex); // Initialize the first slide
    slideInterval = setInterval(nextSlide, 5000); // Start automatic sliding
});
