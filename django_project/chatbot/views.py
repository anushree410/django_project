from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.views.decorators.csrf import csrf_exempt
import requests
from rest_framework import status
import os
from groq import Groq
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from .models import ChatSession, ChatMessage

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@csrf_exempt
@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=["query", "variables"],
        properties={
            "message":  openapi.Schema(type=openapi.TYPE_STRING, example="hi bot!")
        }
    ),
    operation_description="Post a question",
    responses={200: 'Returns a response'},
)
@api_view(['POST'])
def ask_chatbot(request):
    user_message = request.data.get("message", "")
    session = get_object_or_404(ChatSession, id=session_id, user=request.user)
    if not user_message:
        return Response({"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        ChatMessage.objects.create(
            session=session,
            sender="user",
            text=user_message
        )
        completion = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=500
        )

        answer = completion.choices[0].message.content
        ChatMessage.objects.create(
            session=session,
            sender="bot",
            text=answer
        )
        return JsonResponse({"answer": answer})

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_session(request):
    session = ChatSession.objects.create(user=request.user)
    return Response({"session_id": session.id})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def session_history(request, session_id):
    session = get_object_or_404(ChatSession, id=session_id, user=request.user)
    history = [
        {
            "sender": msg.sender,
            "text": msg.text,
            "timestamp": msg.timestamp
        }
        for msg in session.messages.order_by("timestamp")
    ]
    return Response(history)
