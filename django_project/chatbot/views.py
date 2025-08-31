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
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import ChatSession, ChatMessage
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from .models import ChatSession
from .serializers import ChatSessionSerializer

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

topic_param = openapi.Parameter(
    "topic",
    in_=openapi.IN_BODY,
    description="New topic for the chat session",
    type=openapi.TYPE_STRING,
)


@api_view(["PATCH"])
@swagger_auto_schema(
    request_body=ChatSessionSerializer,
    responses={200: ChatSessionSerializer, 404: "Not Found"},
)
@permission_classes([IsAuthenticated])
def update_chat_session(request, session_id):
    try:
        session = ChatSession.objects.get(pk=session_id, user=request.user)
    except ChatSession.DoesNotExist:
        return Response({"error": "Session not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = ChatSessionSerializer(session, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@swagger_auto_schema(
    method='post',
    operation_description="Send a message to the chatbot for a specific session",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=["message"],
        properties={
            "message": openapi.Schema(type=openapi.TYPE_STRING, example="Hello!")
        }
    ),
    responses={200: openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "answer": openapi.Schema(type=openapi.TYPE_STRING, example="Hi, how can I help you?")
        }
    )}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ask_chatbot(request, session_id):
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


@swagger_auto_schema(
    method='post',
    operation_description="Create a new chat session for the authenticated user",
    responses={201: openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "id": openapi.Schema(type=openapi.TYPE_INTEGER, example=3)
        }
    )}
)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_session(request):
    session = ChatSession.objects.create(user=request.user)
    return Response({"id": session.id})

@swagger_auto_schema(
    method='get',
    operation_description="Get history of a particular chat session",
    responses={200: openapi.Schema(
        type=openapi.TYPE_ARRAY,
        items=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "sender": openapi.Schema(type=openapi.TYPE_STRING, example="user"),
                "text": openapi.Schema(type=openapi.TYPE_STRING, example="Hello"),
                "timestamp": openapi.Schema(type=openapi.TYPE_STRING, format="date-time")
            }
        )
    )}
)
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

@swagger_auto_schema(
    method='get',
    operation_description="List all chat sessions for the authenticated user",
    responses={200: openapi.Schema(
        type=openapi.TYPE_ARRAY,
        items=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "id": openapi.Schema(type=openapi.TYPE_INTEGER, example=1),
                "created_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time")
            }
        )
    )}
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_sessions(request):
    sessions = ChatSession.objects.filter(user=request.user).order_by("-created_at")
    serializer = ChatSessionSerializer(sessions, many=True)
    return Response(serializer.data)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_session(request, session_id):
    """
    Deletes a single chat session and all related messages
    for the current user.
    """
    session = get_object_or_404(ChatSession, id=session_id, user=request.user)
    session.delete()
    return Response({"message": "Session deleted"})
