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

// 2. 하트 기능

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
                    console.log(`Total likes: ${data.like_count}`);
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

// 이미지 앞뒤 전환
function toggleImage(img) {
    var frontSrc = img.getAttribute('data-front');
    var backSrc = img.getAttribute('data-back');
    if (img.src.endsWith(frontSrc.split('/').pop())) {
        img.src = backSrc;
        img.setAttribute('data-show', 'back');
    } else {
        img.src = frontSrc;
        img.setAttribute('data-show', 'front');
    }
}

// '뒷판부터 보기' 버튼 기능 추가
document.addEventListener('DOMContentLoaded', function() {
    const showBackButton = document.getElementById('show_back_button');
    let isShowingBack = false;

    showBackButton.addEventListener('click', function() {
        const images = document.querySelectorAll('.test_img');
        isShowingBack = !isShowingBack;

        if (isShowingBack) {
            images.forEach(img => {
                const backSrc = img.getAttribute('data-back');
                img.src = backSrc;
                img.setAttribute('data-show', 'back');
            });
            showBackButton.classList.add('active');
        } else {
            images.forEach(img => {
                const frontSrc = img.getAttribute('data-front');
                img.src = frontSrc;
                img.setAttribute('data-show', 'front');
            });
            showBackButton.classList.remove('active');
        }
    });
});


/////////////여기부터 필터////////////

document.addEventListener('DOMContentLoaded', function() {
    // 로컬 스토리지에서 selectedDepartments 불러오기
    const selectedDepartments = JSON.parse(localStorage.getItem('selectedDepartments')) || [];
    console.log(selectedDepartments);

    // 선택된 학과의 수 계산
    const count = selectedDepartments.length;

    // HTML 요소에 출력
    document.getElementById('filter_count').textContent = count;

    if (count === 0) {
        document.getElementById('icon_filter_bk').style.display = 'flex';
        document.getElementById('icon_filter_blue').style.display = 'none';
        document.getElementById('filter_count').style.visibility = 'hidden';
    } else {
        // count가 0이 아니면 필터 이미지를 파란색으로 바꾸고 filter_count 요소를 표시
        document.getElementById('icon_filter_bk').style.display = 'none';
        document.getElementById('icon_filter_blue').style.display = 'flex';
        document.getElementById('filter_count').style.visibility = 'visible';
        document.getElementById('filter_count').textContent = count;
    }

    // 필터 버튼 클릭 시 필터 페이지로 이동
    document.getElementById('filter_btn').addEventListener('click', function() {
        window.location.href = '/filter';
    });

///////////    초기화 버튼    /////////
document.getElementById('reset_btn').addEventListener('click', function() {
    //selectedDepartments 초기화
    const selectedDepartments = [];
    console.log(selectedDepartments);

    // 로컬 스토리지에 저장
    localStorage.setItem('selectedDepartments', JSON.stringify(selectedDepartments));

    //새로고침 시행
    location.reload();
    })

///////////여기부터 검색 기능//////////

const searchInput = document.getElementById('search_input');
const suggestionsContainer = document.getElementById('suggestions');
const suggestionsList = document.getElementById('suggestions_list');
const searchContainer = document.getElementById('search_container');

searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    if (query.length > 0) {
        fetch(`/search_suggestions/?q=${query}`)
            .then(response => response.json())
            .then(data => {
                console.log('Suggestions:', data); // 서버에서 반환된 데이터 확인
                suggestionsList.innerHTML = '';

                // 중복 제거를 위한 Set
                const uniqueSuggestions = new Set();

                data.forEach(item => {
                    let suggestionText = '';
                    if (item.major) {
                        suggestionText = item.major;
                    } else if (item.college) {
                        suggestionText = item.college;
                    } else if (item.keyword) {
                        suggestionText = item.keyword;
                    }

                    // 중복된 항목을 제외하고 Set에 추가
                    if (!uniqueSuggestions.has(suggestionText)) {
                        uniqueSuggestions.add(suggestionText);
                        const li = document.createElement('li');
                        li.textContent = suggestionText;
            
                        li.addEventListener('click', function() {
                            searchInput.value = suggestionText;
                            suggestionsContainer.style.display = 'none';
                            document.getElementById('search_form').submit(); // 검색 폼 제출
                        });
                        suggestionsList.appendChild(li);
                    }
                });

                if (uniqueSuggestions.size > 0) {
                    suggestionsContainer.style.display = 'block';
                    searchInput.style.borderRadius ='20px 20px 0px 0px';
                    searchInput.style.boxShadow='5px 5px gray';

                } else {
                    suggestionsContainer.style.display = 'none';
                    searchInput.style.borderRadius = '20px';
                    if (searchContainer.style.display === 'none') {
                        searchInput.style.borderRadius = '20px';

                    }
                }
            });
    } 
    else {
        suggestionsContainer.style.display = 'none';
        if (searchContainer.style.display === 'none') {
            searchInput.style.borderRadius = '20px';
        } else {
            searchInput.style.borderRadius = '20px 20px 20px 20px';
        }
    }
});

// 검색 창 토글
if (searchContainer.style.display === 'none') {
    searchContainer.style.display = 'block';
    searchInput.style.borderRadius = '20px 20px 20px 20px';
} else {
    searchContainer.style.display = 'none';
    searchInput.style.borderRadius = '20px 20px 20px 20px';
}


});

