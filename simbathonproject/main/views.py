from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse, HttpResponseBadRequest
from .models import Varsity, Custom, Keyword,Information
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
import json

def startpage(request):
    return render(request, 'main/startpage.html')

def mainpage(request):
    query = request.GET.get('search', '').strip()
    
    if query:
        keywords = Keyword.objects.filter(keyword__icontains=query).values_list('varsity_id', flat=True)
        varsitys = Varsity.objects.filter(
            Q(id__in=keywords) | Q(major__icontains=query) | Q(college__icontains=query)
        )
    else:
        varsitys = Varsity.objects.all()

    # 정렬 순서를 정의합니다.
    custom_order = ['AI융합대학', '경영대학', '경찰사법대학', '공과대학', '문과대학', '미래융합대학', '바이오시스템대학', '법과대학', '불교대학', '사범대학', '사회과학대학', '약학대학', '예술대학', '이과대학', '기타']

    # Varsity 객체들을 custom_order에 따라 정렬합니다.
    sorted_varsitys = sorted(varsitys, key=lambda v: custom_order.index(v.college) if v.college in custom_order else len(custom_order))

    # 사용자가 좋아하는 Varsity 객체들의 ID를 세션에서 가져옵니다.
    liked_varsitys = request.session.get('liked_varsitys', [])

    # 'selectedDepartments' 쿼리 매개변수를 GET 요청에서 가져옵니다.
    selected_departments = request.GET.get('selectedDepartments', '[]')
    # JSON 문자열을 리스트로 변환합니다.
    data_list = json.loads(selected_departments)
    
    # 각 객체의 'label' 값 추출하여 리스트로 만들기
    filter_apply_dep = [item['label'] for item in data_list]

    # 키워드 검색 쿼리 매개변수를 가져옵니다.
    keyword_search = request.GET.get('keyword', '').strip()
    major_search = request.GET.get('major', '').strip()  # 전공 검색 쿼리 매개변수 가져오기

    if keyword_search:
        keywords = Keyword.objects.filter(keyword__icontains=keyword_search).values_list('varsity_id', flat=True)
        varsitys = Varsity.objects.filter(id__in=keywords)
        sorted_varsitys = sorted(varsitys, key=lambda v: custom_order.index(v.college) if v.college in custom_order else len(custom_order))

    elif major_search:  # 전공 검색 쿼리 매개변수가 있으면 필터링
        varsitys = Varsity.objects.filter(major__icontains=major_search)
        sorted_varsitys = sorted(varsitys, key=lambda v: custom_order.index(v.college) if v.college in custom_order else len(custom_order))
    # 필터 조건을 만족하는 항목이 있는지 확인
    we_dont_have = not any(not filter_apply_dep or varsity.major in filter_apply_dep for varsity in sorted_varsitys)   
    filtered_count = sum(1 for varsity in sorted_varsitys if not filter_apply_dep or varsity.major in filter_apply_dep)
    
    context = {
        'varsitys': sorted_varsitys,
        'liked_varsitys': liked_varsitys,
        'filter_apply_dep': filter_apply_dep,  
        'we_dont_have' : we_dont_have,
        'filtered_count':filtered_count,
    }
    return render(request, 'main/mainpage.html', context)





def custompage(request):
    sort_option = request.GET.get('sort', 'likes')
    print(f"정렬 옵션: {sort_option}")  # 디버깅을 위한 출력

    # 최신순 정렬 조건 확인
    if sort_option == 'newest':
        customs = Custom.objects.all().order_by('-id')
        print("최신순으로 정렬")  # 디버깅을 위한 출력
    else:
        customs = Custom.objects.all().order_by('-like_count')
        print("좋아요 순으로 정렬")  # 디버깅을 위한 출력

    query = request.GET.get('search')
    if query:
        customs = customs.filter(
            Q(title__icontains=query) | Q(major__icontains=query) | Q(college__icontains=query) | Q(color__icontains=query)
        )

    liked_customs = request.session.get('liked_customs', [])
    
    selected_departments = request.GET.get('selectedDepartments', '[]')
    data_list = json.loads(selected_departments)
    filter_apply_dep = [item['label'] for item in data_list]

    if filter_apply_dep:
        customs = customs.filter(major__in=filter_apply_dep)

    # 필터 조건을 만족하는 항목이 있는지 확인
    we_dont_have = not any(not filter_apply_dep or custom.major in filter_apply_dep for custom in customs)  
    filtered_count = sum(1 for custom in customs if not filter_apply_dep or custom.major in filter_apply_dep)

    context = {
        'customs': customs,
        'liked_customs': liked_customs,
        'filter_apply_dep': filter_apply_dep, 
        'we_dont_have': we_dont_have, 
        'filtered_count':filtered_count,
    }
    return render(request, 'main/custompage.html', context)



def selectpage(request):
    return render(request, 'design/select_page.html')

def designstartpage(request):
    return render(request, 'design/start_page.html')

def designpage(request):
    return render(request, 'design/designpage.html')

def get_colleges(request):
    colleges = Information.objects.values_list('college', flat=True).distinct()
    return JsonResponse(list(colleges), safe=False)

def get_majors(request):
    college = request.GET.get('college')
    majors = Information.objects.filter(college=college).values_list('major', flat=True).distinct()
    return JsonResponse(list(majors), safe=False)

def informationpage(request):
    return render(request, 'design/informationpage.html')

@csrf_exempt
def like_varsity(request, varsity_id):
    if request.method == 'POST':
        varsity = get_object_or_404(Varsity, id=varsity_id)
        liked_varsitys = request.session.get('liked_varsitys', [])
        if varsity_id in liked_varsitys:
            liked_varsitys.remove(varsity_id)
            varsity.like_count -= 1
            is_liked = False
        else:
            liked_varsitys.append(varsity_id)
            varsity.like_count += 1
            is_liked = True
        varsity.save()
        request.session['liked_varsitys'] = liked_varsitys
        return JsonResponse({'like_count': varsity.like_count, 'is_liked': is_liked})
    return JsonResponse({'error': 'Invalid request'}, status=400)

def create(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        image = request.FILES.get('image')
        college = request.POST.get('college')
        major = request.POST.get('major')
        color = request.POST.get('color')  # 폼에서 넘어온 color 값 받기

        if not title or not image or not college or not major or not color:
            # 필드가 비어있는 경우
            return render(request, 'design/informationpage.html')

        new_custom = Custom(title=title, image=image, college=college, major=major, color=color)
        new_custom.save()

        # 저장된 데이터 개수를 세션에 저장
        request.session['total_customs'] = Custom.objects.count()

        # 데이터가 성공적으로 저장된 후 리디렉션 수행
        return redirect('main:finishpage')
    return redirect('/finish')

def filterpage(request):
    return render(request, 'main/filterpage.html')

def customfilterpage(request):
    return render(request, 'main/customfilterpage.html')

@csrf_exempt
def like_custom(request, custom_id):
    if request.method == 'POST':
        custom = get_object_or_404(Custom, id=custom_id)
        liked_customs = request.session.get('liked_customs', [])
        if custom_id in liked_customs:
            liked_customs.remove(custom_id)
            custom.like_count -= 1
            is_liked = False
        else:
            liked_customs.append(custom_id)
            custom.like_count += 1
            is_liked = True
        custom.save()
        request.session['liked_customs'] = liked_customs
        return JsonResponse({'like_count': custom.like_count, 'is_liked': is_liked})
    return JsonResponse({'error': 'Invalid request'}, status=400)

def search_suggestions(request):
    query = request.GET.get('q', '').strip()
    if query:
        varsity_suggestions = Varsity.objects.filter(
            Q(major__icontains=query) | Q(college__icontains=query)
        ).values('major', 'college')

        keyword_suggestions = Keyword.objects.filter(
            Q(keyword__icontains=query)
        ).values('keyword')

        suggestions = list(varsity_suggestions) + list(keyword_suggestions)
        return JsonResponse(suggestions, safe=False)
    return JsonResponse([], safe=False)


def custom_suggestions(request):
    query = request.GET.get('q', '')
    if query:
        suggestions = Custom.objects.filter(
            Q(title__icontains=query) | Q(major__icontains=query) | Q(college__icontains=query) | Q(color__icontains=query)
        ).values('title', 'major', 'college', 'color').distinct()
        return JsonResponse(list(suggestions), safe=False)
    return JsonResponse([], safe=False)


def finishpage(request):
    return render(request, 'design/finishpage.html')