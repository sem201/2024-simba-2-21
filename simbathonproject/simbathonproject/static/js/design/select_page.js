// select_page.js

// 선택된 이미지를 저장할 변수
let selectedImage = null;

// 모든 이미지 요소를 가져옴
const images = document.querySelectorAll('.template_item');
console.log(images)
// 각 이미지에 클릭 이벤트 리스너 추가
images.forEach((img, index) => {
    img.addEventListener('click', () => {
        // 이전에 선택된 이미지가 있으면 테두리 색상 원래대로 돌림
        if (selectedImage) {
            selectedImage.style.border = `2px solid black`;
            img.style.borderRadius=`10px`
        }

        // 현재 선택된 이미지 테두리 색상 파란색으로 변경
        img.style.border = `4px solid rgba(0, 133, 255, 1)`;
        img.style.borderRadius=`10px`
        selectedImage = img;

        // 선택된 이미지 정보를 localStorage에 저장
        localStorage.setItem('selectedImage', img.src);
    });
});

// "선택 완료" 버튼 클릭 시 다음 페이지로 이동
const selectBtn = document.getElementById('select_btn');
selectBtn.addEventListener('click', () => {
    if (selectedImage) {
        window.location.href = 'next_page.html'; // 다음 페이지로 이동
    } else {
        alert('이미지를 선택해주세요.');
    }
});
