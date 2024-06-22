from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from .models import Varsity, Custom
from django.views.decorators.csrf import csrf_exempt

def startpage(request):
    return render(request, 'main/startpage.html')

def mainpage(request):
    varsitys = Varsity.objects.all()

    custom_order = ['AI융합대학', '경영대학', '경찰사법대학', '공과대학', '문과대학', '미래융합대학', '바이오시스템대학', '법과대학', '불교대학', '사범대학', '사회과학대학', '약학대학', '예술대학', '이과대학']
    
    sorted_varsitys = sorted(varsitys, key=lambda v: custom_order.index(v.college) if v.college in custom_order else len(custom_order))

    liked_varsitys = request.session.get('liked_varsitys', [])
    return render(request, 'main/mainpage.html', {'varsitys': sorted_varsitys, 'liked_varsitys': liked_varsitys})

def custompage(request):
    customs = Custom.objects.all()

    liked_customs = request.session.get('liked_customs', [])
    return render(request, 'main/custompage.html', {'customs': customs, 'liked_customs': liked_customs})

def selectpage(request):
    return render(request, 'design/select_page.html')

def designstartpage(request):
    return render(request, 'design/start_page.html')

def designpage(request):
    return render(request, 'design/designpage.html')

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
    new_custom=Custom()

    new_custom.title=request.POST['title']
    new_custom.image=request.FILES.get('image')
    new_custom.college=request.POST['college']
    new_custom.major=request.POST['major']

    new_custom.save()
    return redirect('custom/')

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