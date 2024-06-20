from django.shortcuts import render, redirect, get_object_or_404
from .models import Varsity
# Create your views here.
def mainpage(request):
    varsitys= Varsity.objects.all()
    return render(request,'main/mainpage.html', {'varsitys': varsitys})

def custompage(request):
    return render(request,'main/custompage.html')
def design_start_page(request):
    return render(request,'design/start_page.html')

def design_select_page(request):
    return render(request,'design/select_page.html')

# def varsity(request):
#     varsity = Varsity(
#         college=request.POST['college'],
#         major=request.POST['major'],
#         image_front=request.FILES.get('image_front'),
#         image_back=request.FILES.get('image_back')
#     )
#     varsity.save()
#     return redirect('mainpage')
