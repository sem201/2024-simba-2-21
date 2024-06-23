function toggleDepartments(collegeId) {
    const departmentContainer = document.getElementById(collegeId + 'Departments');
    if (departmentContainer.style.display === 'none' || departmentContainer.style.display === '') {
        departmentContainer.style.display = 'block';
    } else {
        departmentContainer.style.display = 'none';
    }
}

// Toggle all department checkboxes based on the college checkbox state
document.querySelectorAll('.college').forEach(collegeCheckbox => {
    collegeCheckbox.addEventListener('change', function() {
        const collegeId = this.dataset.college;
        const departmentCheckboxes = document.querySelectorAll(`.department[data-college="${collegeId}"]`);
        departmentCheckboxes.forEach(departmentCheckbox => {
            departmentCheckbox.checked = this.checked;
        });
    });
});

// Toggle department container visibility
document.querySelectorAll('.college-label').forEach(label => {
    label.addEventListener('click', function() {
        const collegeId = this.previousElementSibling.dataset.college;
        toggleDepartments(collegeId);
    });
});

function toggleDepartments(collegeId) {
       const departmentContainer = document.getElementById(collegeId + 'Departments');
       if (departmentContainer.style.display === 'none' || departmentContainer.style.display === '') {
           departmentContainer.style.display = 'block';
       } else {
           departmentContainer.style.display = 'none';
       }
   }

///////필터/////

document.getElementById('apply_filter_btn').addEventListener('click', function() {
    // 선택된 학과 저장
    const selectedDepartments = [];
    document.querySelectorAll('.department:checked').forEach(checkbox => {
        selectedDepartments.push({
            label: checkbox.nextElementSibling.textContent
        });
    });
    
    console.log(selectedDepartments);

    // 로컬 스토리지에 저장
    localStorage.setItem('selectedDepartments', JSON.stringify(selectedDepartments));

    // 선택된 학과를 쿼리 매개변수로 변환
    const query = encodeURIComponent(JSON.stringify(selectedDepartments));
    // 메인 페이지로 이동하면서 쿼리 매개변수 전달
    window.location.href = `/main?selectedDepartments=${query}`;
});

document.getElementById('back_btn').addEventListener('click', function() {
    //selectedDepartments 초기화
    const selectedDepartments = [];
    console.log(selectedDepartments);

    // 로컬 스토리지에 저장
    localStorage.setItem('selectedDepartments', JSON.stringify(selectedDepartments));

    // 선택된 학과를 쿼리 매개변수로 변환
    const query = encodeURIComponent(JSON.stringify(selectedDepartments));
    // 메인 페이지로 이동하면서 쿼리 매개변수 전달
    window.location.href = `/main?selectedDepartments=${query}`;
})

document.querySelector('.search_form').addEventListener('submit', function(event) {
    event.preventDefault();
    const searchInput = document.querySelector('.search_form input').value.trim();
    if (searchInput) {
        window.location.href = `/main?keyword=${encodeURIComponent(searchInput)}`;
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const suggestions = document.getElementById('suggestions');

    searchInput.addEventListener('input', function() {
        const query = searchInput.value.trim();
        if (query.length > 0) {
            fetch(`/search_suggestions/?query=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    suggestions.innerHTML = '';
                    data.suggestions.forEach(suggestion => {
                        const div = document.createElement('div');
                        div.className = 'suggestion';
                        div.textContent = suggestion;
                        div.addEventListener('click', function() {
                            searchInput.value = suggestion;
                            suggestions.innerHTML = '';
                        });
                        suggestions.appendChild(div);
                    });
                });
        } else {
            suggestions.innerHTML = '';
        }
    });
});


