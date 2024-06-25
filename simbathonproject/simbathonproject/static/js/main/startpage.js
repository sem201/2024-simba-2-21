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
    }, 1500);

    // Set display to none after fade out
    setTimeout(() => {
        logoPage.style.display = 'none';
    }, 2500);

    setTimeout(() => {
        document.querySelector('.slider__btn_container').style.opacity = '1';
        document.querySelector('.slider__inner').style.opacity = '1';
    }, 2100);

    setTimeout(() => {
        const slideInnerElements = document.querySelectorAll('.slider__inner');
        if (slideInnerElements.length > 0) {
            slideInnerElements.forEach(element => {
                element.style.opacity = '1';
            });
        } else {
            console.error('.slider__inner 요소를 찾을 수 없습니다.');
        }
    }, 2100);
    console.log(document.querySelector('.slider__inner')); // null이면 요소가 존재하지 않음
    console.log(document.querySelector('.slider__btn_container')); // null이면 요소가 존재하지 않음

    // Function to update slider position and dots
    function updateSlider() {
        sliderWrap.style.transform = `translateX(-${currentIndex * 100}%)`;
        sliderDots.forEach((dot, index) => {
            dot.classList.toggle('slider_dot_select', index === currentIndex);
        });
        if (currentIndex === sliderDots.length - 1) {
            continueBtn.style.display = 'none';
            startBtn.style.display = 'block';
            skipBtn.style.visibility = 'hidden';
            document.querySelector('.slider__btn_container').style.opacity = '1';
        } else {
            continueBtn.style.display = 'block';
            startBtn.style.display = 'none';
            skipBtn.style.visibility = 'visible';
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
