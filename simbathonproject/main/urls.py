from django.urls import path
from .views import *

app_name='main'
urlpatterns = [
    path('', startpage, name='startpage'),
    path('main/', mainpage, name='mainpage'),
    path('like/<int:varsity_id>/', like_varsity, name='like_varsity'),
    path('custom/',custompage,name='custompage'),
    path('likecustom/<int:custom_id>/', like_custom, name='like_custom'),
    path('design/', designstartpage,name='start_page'),
    path('design/select/', selectpage, name='select_page'),
    path('design/select/designvarsity/', designpage, name='designpage'),
    path('design/select/designvarsity/information', informationpage, name='informationpage'),
    path('create', create, name='create'),
    path('filter/', filterpage, name='filterpage'),
    path('customfilter/', customfilterpage, name='customfilterpage'),
    path('search_suggestions/', search_suggestions, name='search_suggestions'),

    path('get_colleges/', get_colleges, name='get_colleges'),
    path('get_majors/', get_majors, name='get_majors'),
]


