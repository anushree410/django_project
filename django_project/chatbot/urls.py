from django.urls import path
from .views import session_history, create_session, ask_chatbot

urlpatterns = [
    # path('ask/', ask_chatbot, name='chatbot-response'),
    path("session/", create_session),
    path("session/<int:session_id>/ask/", ask_chatbot),
    path("session/<int:session_id>/history/", session_history),
]
