document.addEventListener('DOMContentLoaded', function () {
    const logoPage = document.querySelector('.logo_page');
    const sliderWrap = document.getElementById('slider_wrap');
    const sliderDots = document.querySelectorAll('.slider_dot');
    const continueBtn = document.getElementById('continue_btn');
    const startBtn = document.getElementById('start_btn');
    const skipBtn = document.getElementById('skip');
    let currentIndex = 0;

    // Logo page timer
    setTimeout(() => {
        logoPage.style.opacity = '0';
    }, 700);

    // Set display to none after fade out
    setTimeout(() => {
        logoPage.style.display = 'none';
    }, 1700);

    // Function to update slider position and dots
    function updateSlider() {
        sliderWrap.style.transform = `translateX(-${currentIndex * 100}%)`;
        sliderDots.forEach((dot, index) => {
            dot.classList.toggle('slider_dot_select', index === currentIndex);
        });
        if (currentIndex === sliderDots.length - 1) {
            continueBtn.style.display = 'none';
            startBtn.style.display = 'block';
            skipBtn.style.display = 'none';
        } else {
            continueBtn.style.display = 'block';
            startBtn.style.display = 'none';
            skipBtn.style.display = 'block';
        }
    }

    // Continue button event listener
    continueBtn.addEventListener('click', () => {
        if (currentIndex < sliderDots.length - 1) {
            currentIndex++;
            updateSlider();
        }
    });
});
