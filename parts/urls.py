from django.urls import path

from . import views

urlpatterns = [
    path('fetch', views.parts_list, name="parts_list"),
    path('', views.index, name="index"),
    path('delete', views.delete_part, name='delete_part'),
]
