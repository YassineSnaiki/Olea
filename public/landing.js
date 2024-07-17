document.addEventListener("DOMContentLoaded", function() {
    const slider = document.querySelector(".slider");
    const slides = document.querySelectorAll(".slide");
    const slideCount = slides.length;
    let currentIndex = 0;
  
    // Function to move to the next slide
    function nextSlide() {
      const nextIndex = (currentIndex + 1) % slideCount;
      slides[currentIndex].classList.remove("active");
      slides[nextIndex].classList.add("active");
      currentIndex = nextIndex;
    }
  
    // Auto slide change
    function autoSlide() {
      nextSlide();
      setTimeout(autoSlide, 5000); // Change slide every 5 seconds (adjust as needed)
    }
  
    // Start auto slide change
    autoSlide();
  });
  