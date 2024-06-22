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

   // 체크박스 상태 변경 시 필터링 기능을 실행하는 함수
   function filterData() {
       // DB에서 가져온 데이터의 예시
       const data = [
           { college: 'ai', department: 'aiSoftware', name: 'AI소프트웨어융합학부' },
           { college: 'ai', department: 'semiconductor', name: '시스템반도체학부' },
           { college: 'business', department: 'managementInfo', name: '경영정보학과' },
           { college: 'business', department: 'management', name: '경영학과' },
           { college: 'business', department: 'accounting', name: '회계학과' }
       ];

       // 선택된 체크박스들을 가져옴
       const checkedDepartments = document.querySelectorAll('.department:checked');

       // 필터링된 데이터를 저장할 배열
       let filteredData = [];

       // 선택된 체크박스의 데이터를 가져와서 필터링
       checkedDepartments.forEach(dept => {
           const college = dept.getAttribute('data-college');
           const department = dept.getAttribute('data-department');

           data.forEach(item => {
               if (item.college === college && item.department === department) {
                   filteredData.push(item);
               }
           });
       });

       // 필터링된 데이터를 mainpage에 표시
       const mainpage = document.getElementById('mainpage');
       mainpage.innerHTML = ''; // 기존 내용을 지움

       if (filteredData.length > 0) {
           filteredData.forEach(item => {
               const div = document.createElement('div');
               div.textContent = `${item.college} - ${item.department}: ${item.name}`;
               mainpage.appendChild(div);
           });
       } else {
           mainpage.textContent = '선택된 항목이 없습니다.';
       }
   }

   // 각 체크박스에 필터링 이벤트 추가
   document.querySelectorAll('.department').forEach(deptCheckbox => {
       deptCheckbox.addEventListener('change', filterData);
   });