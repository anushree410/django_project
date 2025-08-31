from django.urls import path
from .views import session_history, create_session, ask_chatbot, list_sessions, delete_session, update_chat_session
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework.permissions import AllowAny
schema_view = get_schema_view(
    openapi.Info(
        title="My API",
        default_version='v1',
        description="API docs",
    ),
    public=True,
    permission_classes=(AllowAny,),
    authentication_classes=[],
)

urlpatterns = [
    path("session/", list_sessions),
    path("session/create/", create_session),
    path("session/<int:session_id>/ask/", ask_chatbot),
    path("session/<int:session_id>/history/", session_history),
    path("session/<int:session_id>/delete/", delete_session),
    path("session/<int:session_id>/update/", update_chat_session, name="update-session"),
]
