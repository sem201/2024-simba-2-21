document.addEventListener('DOMContentLoaded', () => {
    const addTextButton = document.getElementById('add-text-button');
    const captureButton = document.getElementById('capture-button');
    const inputContainer = document.getElementById('input-container');
    const textInput = document.getElementById('text-input');
    const uploadTextButton = document.getElementById('upload-text');
    const topContainer = document.getElementById('top-container');
    const uploadImgButton = document.getElementById('upload-img-button');
    const imageInput = document.getElementById('image-input');
    let currentRotateButton = null;
    let currentResizeButton = null;

    // 이전 페이지에서 선택한 키워드 값을 콘솔에 출력
    const selectedKeyword = localStorage.getItem('selectedKeyword');
    if (selectedKeyword) {
        console.log('선택한 키워드:', selectedKeyword);
    } else {
        console.log('선택한 키워드가 없습니다.');
    }
    

    addTextButton.addEventListener('click', () => {
        if (inputContainer.style.display === 'block') {
            inputContainer.style.display = 'none';
        } else {
            inputContainer.style.display = 'block';
            inputContainer.style.position = 'absolute';
            inputContainer.style.bottom = '70px';
            inputContainer.style.right = '50%';
            inputContainer.style.transform = 'translateX(50%)';
        }
    });

    uploadTextButton.addEventListener('click', () => {
        const newText = textInput.value;
        if (newText.trim() === '') return;

        const newDiv = document.createElement('div');
        newDiv.className = 'draggable';
        newDiv.textContent = newText;
        newDiv.style.position = 'absolute';
        newDiv.style.left = '50%';
        newDiv.style.top = '50%';
        newDiv.style.transform = 'translate(-50%, -50%)';
        newDiv.style.cursor = 'move';
        newDiv.style.whiteSpace = 'nowrap'; 
        newDiv.style.fontSize='20px';
        newDiv.style.fontWeight='bold';

        const rotateButton = document.createElement('img');
        rotateButton.src = '/static/assets/icons/icon-rotate.png';
        rotateButton.className = 'rotate-button';
        rotateButton.style.position = 'absolute';
        rotateButton.style.top = '-20px';
        rotateButton.style.left = '50%';
        rotateButton.style.transform = 'translateX(-50%)';
        rotateButton.style.cursor = 'pointer';
        rotateButton.style.display = 'none';
        rotateButton.style.zIndex = '20';

        topContainer.appendChild(rotateButton);
        topContainer.appendChild(newDiv);

        makeDraggable(newDiv);
        makeRotatable(newDiv, rotateButton);

        newDiv.addEventListener('click', (event) => {
            event.stopPropagation();
            hideAllButtons();
            rotateButton.style.display = 'block';
            currentRotateButton = rotateButton;
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

            topContainer.appendChild(img);
            topContainer.appendChild(rotateButton);
            topContainer.appendChild(resizeButton);

            makeDraggable(img);
            makeRotatable(img, rotateButton);
            makeResizable(img, resizeButton);

            img.addEventListener('click', (event) => {
                event.stopPropagation();
                hideAllButtons();
                rotateButton.style.display = 'block';
                resizeButton.style.display = 'block';
                const imgRect = img.getBoundingClientRect();
                rotateButton.style.top = `${imgRect.top - topContainer.getBoundingClientRect().top - rotateButton.offsetHeight}px`;
                resizeButton.style.top = `${imgRect.bottom - topContainer.getBoundingClientRect().top - 5}px`;
                resizeButton.style.left = `${imgRect.right - topContainer.getBoundingClientRect().left - 5}px`;
                currentRotateButton = rotateButton;
                currentResizeButton = resizeButton;
            });
        };
        reader.readAsDataURL(file);

        imageInput.value = '';
    });

    function makeDraggable(element) {
        element.addEventListener('mousedown', (e) => {
            if (e.target.className.includes('rotate-button') || e.target.className.includes('resize-button')) return;

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
        rotateButtons.forEach(button => button.style.display = 'none');
        resizeButtons.forEach(button => button.style.display = 'none');
    }

    document.addEventListener('click', () => {
        hideAllButtons();
    });

    captureButton.addEventListener('click', () => {
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
            html2canvas(document.querySelector('#top-container')).then(canvas => {
                // 이미지를 다운로드할 수 있도록 Blob URL을 생성
                const imageUrl = canvas.toDataURL('image/png');

                // Blob URL을 이용해 다운로드 링크를 생성
                const link = document.createElement('a');
                link.href = imageUrl;
                link.download = 'capture.png';

                // 링크를 클릭하여 다운로드 진행
                link.click();
            }).catch(error => {
                console.error('캡처 중 오류 발생:', error);
            });
        }).catch(error => {
            console.error('이미지 로드 중 오류 발생:', error);
        });
    });
});
