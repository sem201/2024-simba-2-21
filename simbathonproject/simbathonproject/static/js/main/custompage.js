document.addEventListener('DOMContentLoaded', () => {
    // HTML의 data- 속성에서 total_customs 값을 가져옴
    var totalCustoms = document.getElementById('container').getAttribute('data-total-customs');
    console.log("Total customs: ", totalCustoms);

    if (totalCustoms === null) {
        console.error('totalCustoms 값이 null입니다.');
        return;
    }

    var sliderInner = document.getElementById('sliderInner');
    if (!sliderInner) {
        console.error('sliderInner 요소를 찾을 수 없습니다.');
        return;
    }
    sliderInner.style.width = (540 * totalCustoms) + 'px';

    const sliderWrap = document.querySelector('.slider__wrap');
    const sliderImg = sliderWrap.querySelector('.slider__img');
    const sliders = sliderWrap.querySelectorAll('.slider');
    const sliderDot = sliderWrap.querySelector('.slider__dot');
    const sliderBtn = sliderWrap.querySelectorAll('.slider__btn a');

    if (!sliderDot) {
        console.error('sliderDot 요소를 찾을 수 없습니다.');
        return;
    }

    let currentIndex = 0;
    const sliderCount = sliders.length;
    const sliderWidth = sliders[0].offsetWidth;
    let dotIndex = '';

    function init() {
        sliders.forEach(() => dotIndex += "<a href='#' class='dot'></a>");
        sliderDot.innerHTML = dotIndex;
        if (sliderDot.firstChild) {
            sliderDot.firstChild.classList.add('active');
        }
    }

    function gotoSlider(num) {
        sliderInner.style.transition = 'all 0.4s';
        sliderInner.style.transform = 'translateX(' + (-sliderWidth * num) + 'px)';
        currentIndex = num;

        const dots = document.querySelectorAll('.slider__dot .dot');
        if (dots && dots.length > 0) {
            dots.forEach((dot) => dot.classList.remove('active'));
            if (dots[num]) {
                dots[num].classList.add('active');
            } else {
                console.error('dots[' + num + '] 요소를 찾을 수 없습니다.');
            }
        } else {
            console.error('.slider__dot .dot 요소를 찾을 수 없습니다.');
        }
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

    const heartButtons = document.querySelectorAll('#heart_btn');

    heartButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log("Heart button clicked"); // 디버그 로그 추가

            const customId = this.dataset.customId;
            const likeCountElem = this.querySelector('p');
            const iconHeart = this.querySelector('#icon_heart');

            fetch(`/likecustom/${customId}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'Content-Type': 'application/json'
                },
            })
            .then(response => response.json())
            .then(data => {
                console.log("Response data:", data); // 디버그 로그 추가
                if (data.like_count !== undefined) {
                    likeCountElem.textContent = data.like_count;
                    if (data.is_liked) {
                        iconHeart.src = "/static/assets/icons/heart_filled.png";
                    } else {
                        iconHeart.src = "/static/assets/icons/heart.png";
                    }
                    console.log(`Total likes: ${data.like_count}`);
                } else {
                    console.log("like_count is undefined"); // 디버그 로그 추가
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
