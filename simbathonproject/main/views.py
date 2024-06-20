from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from .models import Varsity, Custom

def startpage(request):
    return render(request, 'main/startpage.html')

def mainpage(request):
    varsitys = Varsity.objects.all()
    liked_varsitys = request.session.get('liked_varsitys', [])
    return render(request, 'main/mainpage.html', {'varsitys': varsitys, 'liked_varsitys': liked_varsitys})

def custompage(request):
    customs = Custom.objects.all()
    liked_customs = request.session.get('liked_customs', [])
    return render(request, 'main/custompage.html', {'customs': customs, 'liked_customs': liked_customs})

def selectpage(request):
    return render(request, 'design/select_page.html')

def designpage(request):
    return render(request, 'design/designpage.html')

def informationpage(request):
    return render(request, 'design/informationpage.html')

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

def information(request):
    new_custom=Custom()

    new_custom.title=request.POST['title']
    new_custom.image=request.FILES.get('image')
    new_custom.college=request.POST['college']
    new_custom.major=request.POST['major']

    new_custom.save()
    return render('design:informationpage')