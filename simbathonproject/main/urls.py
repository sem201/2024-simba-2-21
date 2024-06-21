from django.urls import path
from .views import *

app_name='main'
urlpatterns = [
    path('', startpage, name='startpage'),
    path('main/', mainpage, name='mainpage'),
    path('like/<int:varsity_id>/', like_varsity, name='like_varsity'),
    path('custom/',custompage,name='custompage'),
    path('design/', designstartpage,name='start_page'),
    path('design/select/', selectpage, name='select_page'),
    path('design/select/designvarsity/', designpage, name='designpage'),
    path('design/select/designvarsity/information', informationpage, name='informationpage'),
    # path('create', create, name='create'),
]


