from django.urls import path
from .views import leetcode_proxy, profile,register_user, create_admin, list_users
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('leetcode', leetcode_proxy),
    path('profile/', profile, name='profile'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register_user, name='register'),
    path("create-admin/", create_admin),
    path('users/', list_users),
]
