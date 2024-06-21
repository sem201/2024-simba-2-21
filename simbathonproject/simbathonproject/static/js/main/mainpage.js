document.addEventListener('DOMContentLoaded', () => {
    const sliderWrap = document.querySelector('.slider__wrap');
    const sliderImg = sliderWrap.querySelector('.slider__img');
    const sliderInner = sliderWrap.querySelector('.slider__inner');
    const sliders = sliderWrap.querySelectorAll('.slider');
    const sliderDot = sliderWrap.querySelector('.slider__dot');
    const sliderBtn = sliderWrap.querySelectorAll('.slider__btn a');

    let currentIndex = 0;
    const sliderCount = sliders.length;
    const sliderWidth = sliders[0].offsetWidth;
    let dotIndex = '';

    function init() {
        sliders.forEach(() => dotIndex += "<a href='#' class='dot'>이미지</a>");
        sliderDot.innerHTML = dotIndex;
        sliderDot.firstChild.classList.add('active');
    }

    function gotoSlider(num) {
        sliderInner.style.transition = 'all 0.4s';
        sliderInner.style.transform = 'translateX(' + (-sliderWidth * num) + 'px)';
        currentIndex = num;

        const dots = document.querySelectorAll('.slider__dot .dot');
        dots.forEach((dot) => dot.classList.remove('active'));
        dots[num].classList.add('active');
    }

    sliderBtn.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            let newIndex = currentIndex;

            if (btn.classList.contains('prev')) {
                newIndex = (currentIndex + sliderCount - 1) % sliderCount;
            } else {
                newIndex = (currentIndex + 1) % sliderCount;
            }

            gotoSlider(newIndex);
        });
    });

    init();
});

document.addEventListener('DOMContentLoaded', function() {
    const heartButtons = document.querySelectorAll('#heart_btn');

    heartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const varsityId = this.dataset.varsityId;
            const likeCountElem = this.querySelector('p');
            const iconHeart = this.querySelector('#icon_heart');

            fetch(`/like/${varsityId}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'Content-Type': 'application/json'
                },
            })
            .then(response => response.json())
            .then(data => {
                if (data.like_count !== undefined) {
                    likeCountElem.textContent = data.like_count;
                    if (data.is_liked) {
                        iconHeart.src = "/static/assets/icons/heart_filled.png";
                    } else {
                        iconHeart.src = "/static/assets/icons/heart.png";
                    }
                }
            });
        });
    });

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});

