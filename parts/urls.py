from django.urls import path
from .views import PartsListView, delete_part, index

urlpatterns = [
    path('fetch', PartsListView.as_view(), name="parts_list"),
    path('delete', delete_part, name='delete_part'),
    path('', index, name="index"),
]
