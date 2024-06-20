from django.urls import path
from .views import *

app_name='main'
urlpatterns = [
    path('', mainpage, name='mainpage'),
    path('custom/',custompage,name='custompage'),
    path('design/', design_start_page,name='start_page'),
    path('design/select/', design_select_page, name='select_page'),
]

