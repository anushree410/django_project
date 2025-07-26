from django.urls import path
from .views import leetcode_proxy

urlpatterns = [
    path('leetcode', leetcode_proxy),

]
