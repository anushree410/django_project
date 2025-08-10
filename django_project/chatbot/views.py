from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.views.decorators.csrf import csrf_exempt
import requests
from rest_framework import status
import os
from groq import Groq
from django.http import JsonResponse
username_param = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=["query", "variables"],
    properties={
        "message":  openapi.Schema(type=openapi.TYPE_STRING, example="hi bot!")
    }
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@csrf_exempt
@swagger_auto_schema(
    method='post',
    request_body=username_param,
    operation_description="Post a question",
    responses={200: 'Returns a response'},
)
@api_view(['POST'])
def chatbot_response(request):
    user_message = request.data.get("message", "")
    if not user_message:
        return Response({"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        completion = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=500
        )

        answer = completion.choices[0].message.content
        return JsonResponse({"answer": answer})

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
