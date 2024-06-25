document.addEventListener('DOMContentLoaded', () => {
    const addTextButton = document.getElementById('add-text-button');
    const captureButton = document.getElementById('capture-button');
    const inputContainer = document.getElementById('input-container');
    const textInput = document.getElementById('text-input');
    const uploadTextButton = document.getElementById('upload-text');
    const colorSelect = document.getElementById('color-select'); // 추가된 부분
    const sample = document.getElementById('sample');
    const topContainer = document.getElementById('top-container');
    const uploadImgButton = document.getElementById('upload-img-button');
    const imageInput = document.getElementById('image-input');
    const refreshButton = document.getElementById('refresh-button');
    let currentRotateButton = null;
    let currentResizeButton = null;
    let currentDeleteButton = null;

    // 디자인 제출 페이지로 넘어가기 전 확인 메시지
    const normalBtn = document.getElementById('normal_btn');

    const confirm_alert = (event) => {
        const userConfirmed = confirm('이미지 다운로드 하셨나요?');
        if (!userConfirmed) {
            event.preventDefault(); // 기본 동작을 취소합니다.
        }
    }

    normalBtn.addEventListener('click', confirm_alert);

    // 이전 페이지에서 선택한 키워드 값을 콘솔에 출력
    const selectedKeyword = localStorage.getItem('selectedKeyword');
    if (selectedKeyword) {
        console.log('선택한 키워드:', selectedKeyword);
    } else {
        console.log('선택한 키워드가 없습니다.');
    }
    

    addTextButton.addEventListener('click', () => {
        if (inputContainer.style.display === 'flex') {
            inputContainer.style.display = 'none';
            sample.style.zIndex = -10;
        } else {
            inputContainer.style.display = 'flex';
            inputContainer.style.flexDirection = 'row';
            inputContainer.style.position = 'absolute';
            inputContainer.style.bottom = '50%';
            inputContainer.style.right = '50%';
            inputContainer.style.zIndex = 20;
            inputContainer.style.transform = 'translateX(50%)';
            sample.style.zIndex = 10;
        }
    });

    uploadTextButton.addEventListener('click', () => {
        const newText = textInput.value;
        const textColor = colorSelect.value; // 추가된 부분
        if (newText.trim() === '') return;
    
        if (newText.length > 20) {
            alert('텍스트는 20글자 이하로 입력해주세요.');
            return;
        }
    
        const newDiv = document.createElement('div');
        newDiv.className = 'draggable';
        newDiv.textContent = newText;
        newDiv.style.position = 'absolute';
        newDiv.style.left = '50%';
        newDiv.style.top = '50%';
        newDiv.style.transform = 'translate(-50%, -50%)';
        newDiv.style.cursor = 'move';
        newDiv.style.whiteSpace = 'nowrap'; 
        newDiv.style.color = textColor; // 추가된 부분
        newDiv.style.fontSize = '25px';
        newDiv.style.fontWeight = 'bold';
        newDiv.style.fontFamily = 'Playball, cursive'; /* 추가된 부분 */
        sample.style.zIndex = -10;
        const rotateButton = document.createElement('img');
        rotateButton.src = '/static/assets/icons/icon-rotate.png';
        rotateButton.className = 'rotate-button';
        rotateButton.style.position = 'absolute';
        rotateButton.style.top = '50%';
        rotateButton.style.left = '50%';
        rotateButton.style.transform = 'translateX(-50%)';
        rotateButton.style.cursor = 'pointer';
        rotateButton.style.display = 'none';
        rotateButton.style.zIndex = '20';


        const deleteButton = document.createElement('img');
        deleteButton.src = '/static/assets/icons/trash_icon.png'; 
        deleteButton.className = 'delete-button';
        deleteButton.style.position = 'absolute';
        deleteButton.style.cursor = 'pointer';
        deleteButton.style.display = 'none';
        deleteButton.style.zIndex = '20';

        topContainer.appendChild(rotateButton);
        topContainer.appendChild(deleteButton);
        topContainer.appendChild(newDiv);
    
        makeDraggable(newDiv);
        makeRotatable(newDiv, rotateButton);
    
        newDiv.addEventListener('click', (event) => {
            event.stopPropagation();
            hideAllButtons();
            rotateButton.style.display = 'block';
            deleteButton.style.display = 'block';
            const elemRect = newDiv.getBoundingClientRect();
            deleteButton.style.top = `${elemRect.top - topContainer.getBoundingClientRect().top}px`;
            deleteButton.style.left = `${elemRect.left - topContainer.getBoundingClientRect().left-10}px`;
            currentRotateButton = rotateButton;
            currentDeleteButton = deleteButton;
        });

        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation();
            newDiv.remove();
            rotateButton.remove();
            deleteButton.remove();
        });
        textInput.value = '';
        inputContainer.style.display = 'none';
    });
    
    uploadImgButton.addEventListener('click', () => {
        imageInput.click();
    });

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            const img = document.createElement('img');
            img.src = event.target.result;
            img.className = 'draggable resizable';
            img.style.position = 'absolute';
            img.style.left = '50%';
            img.style.top = '50%';
            img.style.transform = 'translate(-50%, -50%)';
            img.style.cursor = 'move';
            img.style.zIndex = '10';

            const rotateButton = document.createElement('img');
            rotateButton.src = '/static/assets/icons/icon-rotate.png';
            rotateButton.className = 'rotate-button';
            rotateButton.style.position = 'absolute';
            rotateButton.style.transform = 'translateX(-50%)';
            rotateButton.style.cursor = 'pointer';
            rotateButton.style.display = 'none';
            rotateButton.style.zIndex = '20';

            const resizeButton = document.createElement('div');
            resizeButton.className = 'resize-button';
            resizeButton.style.position = 'absolute';
            resizeButton.style.right = '0px';
            resizeButton.style.bottom = '0px';
            resizeButton.style.display = 'none';

            const deleteButton = document.createElement('img');
            deleteButton.src = '/static/assets/icons/trash_icon.png'; 
            deleteButton.className = 'delete-button';
            deleteButton.style.position = 'absolute';
            deleteButton.style.cursor = 'pointer';
            deleteButton.style.display = 'none';
            deleteButton.style.zIndex = '20';

            topContainer.appendChild(img);
            topContainer.appendChild(rotateButton);
            topContainer.appendChild(resizeButton);
            topContainer.appendChild(deleteButton);

            makeDraggable(img);
            makeRotatable(img, rotateButton);
            makeResizable(img, resizeButton);

            img.addEventListener('click', (event) => {
                event.stopPropagation();
                hideAllButtons();
                rotateButton.style.display = 'block';
                resizeButton.style.display = 'block';
                deleteButton.style.display = 'block';
                const imgRect = img.getBoundingClientRect();
                rotateButton.style.top = `${imgRect.top - topContainer.getBoundingClientRect().top - rotateButton.offsetHeight}px`;
                resizeButton.style.top = `${imgRect.bottom - topContainer.getBoundingClientRect().top - 5}px`;
                resizeButton.style.left = `${imgRect.right - topContainer.getBoundingClientRect().left - 5}px`;
                deleteButton.style.top = `${imgRect.top - topContainer.getBoundingClientRect().top}px`;
                deleteButton.style.left = `${imgRect.left - topContainer.getBoundingClientRect().left-10}px`;
                currentRotateButton = rotateButton;
                currentResizeButton = resizeButton;
                currentDeleteButton = deleteButton;
            });

            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation();
                img.remove();
                rotateButton.remove();
                resizeButton.remove();
                deleteButton.remove();
            });
        };
        reader.readAsDataURL(file);

        imageInput.value = '';
    });
    refreshButton.addEventListener('click', () => {
        const elementsToRemove = topContainer.querySelectorAll('.draggable, .resizable, .rotate-button, .resize-button');
        elementsToRemove.forEach(element => {
            topContainer.removeChild(element);
        });
    });

    function makeDraggable(element) {
        element.addEventListener('mousedown', (e) => {
            if (e.target.className.includes('rotate-button') || e.target.className.includes('resize-button') || e.target.className.includes('delete-button')) return;

            let shiftX = element.clientWidth / 5;
            let shiftY = element.clientHeight / 5;

            function moveAt(pageX, pageY) {
                const topContainerRect = topContainer.getBoundingClientRect();
                const newLeft = pageX - shiftX - topContainerRect.left;
                const newTop = pageY - shiftY - topContainerRect.top;

                element.style.left = newLeft + 'px';
                element.style.top = newTop + 'px';

                if (currentRotateButton) {
                    const elemRect = element.getBoundingClientRect();
                    currentRotateButton.style.top = `${elemRect.top - topContainer.getBoundingClientRect().top - currentRotateButton.offsetHeight}px`;
                    currentRotateButton.style.left = `${elemRect.left + elemRect.width / 2 - currentRotateButton.offsetWidth / 2 - topContainer.getBoundingClientRect().left}px`;
                }

                if (currentResizeButton) {
                    const elemRect = element.getBoundingClientRect();
                    currentResizeButton.style.top = `${elemRect.bottom - topContainer.getBoundingClientRect().top - 5}px`;
                    currentResizeButton.style.left = `${elemRect.right - topContainer.getBoundingClientRect().left - 5}px`;
                }

                if (currentDeleteButton) {
                    const elemRect = element.getBoundingClientRect();
                    currentDeleteButton.style.top = `${elemRect.top - topContainer.getBoundingClientRect().top}px`;
                    currentDeleteButton.style.left = `${elemRect.left - topContainer.getBoundingClientRect().left-10}px`;
                }
            }

            function onMouseMove(e) {
                moveAt(e.pageX, e.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', onMouseMove);
            }, { once: true });

            element.ondragstart = function () {
                return false;
            };
        });
    }

    function makeRotatable(element, rotateButton) {
        let isRotating = false;
        let initialAngle = 0;
        let startX = 0;
        let startY = 0;

        rotateButton.addEventListener('mousedown', (e) => {
            isRotating = true;
            startX = e.clientX;
            startY = e.clientY;

            function onRotateMove(e) {
                if (!isRotating) return;

                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                const radians = Math.atan2(dy, dx);
                const angle = radians * (180 / Math.PI);

                element.style.transform = `translate(-50%, -50%) rotate(${initialAngle + angle}deg)`;
            }

            document.addEventListener('mousemove', onRotateMove);

            document.addEventListener('mouseup', (e) => {
                document.removeEventListener('mousemove', onRotateMove);
                isRotating = false;
                initialAngle += Math.atan2(e.clientY - startY, e.clientX - startX) * (180 / Math.PI);
            }, { once: true });

            e.stopPropagation();
        });
    }

    function makeResizable(element, resizeButton) {
        resizeButton.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            const initialWidth = element.offsetWidth;
            const initialHeight = element.offsetHeight;
            const startX = e.clientX;
            const startY = e.clientY;

            function onResizeMove(e) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                element.style.width = `${initialWidth + dx}px`;
                element.style.height = `${initialHeight + dy}px`;

                const elemRect = element.getBoundingClientRect();
                resizeButton.style.top = `${elemRect.bottom - topContainer.getBoundingClientRect().top - 5}px`;
                resizeButton.style.left = `${elemRect.right - topContainer.getBoundingClientRect().left - 5}px`;
            }

            document.addEventListener('mousemove', onResizeMove);

            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', onResizeMove);
            }, { once: true });
        });
    }

    function hideAllButtons() {
        const rotateButtons = document.querySelectorAll('.rotate-button');
        const resizeButtons = document.querySelectorAll('.resize-button');
        const deleteButtons = document.querySelectorAll('.delete-button');
        rotateButtons.forEach(button => button.style.display = 'none');
        resizeButtons.forEach(button => button.style.display = 'none');
        deleteButtons.forEach(button => button.style.display = 'none');
    }

    document.addEventListener('click', () => {
        hideAllButtons();
    });

    captureButton.addEventListener('click', () => {
        const topContainer = document.getElementById('top-container');
        topContainer.style.borderTop = 'none';
        topContainer.style.borderBottom = 'none';
        // topContainer.style.backgroundColor='#FFFFFF'
        hideAllButtons();
        const images = document.querySelectorAll('img');
        const promises = [];

        images.forEach(img => {
            if (img.src.startsWith('blob:')) {
                promises.push(new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = function (event) {
                        img.src = event.target.result;
                        resolve();
                    };
                    reader.onerror = reject;
                    fetch(img.src)
                        .then(response => response.blob())
                        .then(blob => {
                            reader.readAsDataURL(blob);
                        })
                        .catch(reject);
                }));
            }
        });

        Promise.all(promises).then(() => {
            // 약간의 지연을 주어 스타일이 적용되도록 함
            setTimeout(() => {
                html2canvas(document.querySelector('#top-container'), {
                    backgroundColor: null // 배경색을 투명하게 설정
                }).then(canvas => {
                    const imageUrl = canvas.toDataURL('image/png');
    
                    const link = document.createElement('a');
                    link.href = imageUrl;
                    link.download = 'capture.png';
                    link.click();
                }).catch(error => {
                    console.error('캡처 중 오류 발생:', error);
                });
            }, 100); // 100ms 지연
        }).catch(error => {
            console.error('이미지 로드 중 오류 발생:', error);
        });
    });
});
