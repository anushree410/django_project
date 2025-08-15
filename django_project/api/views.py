from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import requests
import json
from .logic import make_date_count_response
from rest_framework.decorators import api_view
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.core.management import call_command
# from flask import Flask, request, jsonify
# import your_core_logic
#
#
# app = Flask(__name__)
#
# @app.route('/run', methods=['POST'])
# def run_code():
#     data = request.json
#     result = your_core_logic.do_something(data['input'])
#     return jsonify({'result': result})
# --- TEMPORARY SUPERUSER ENDPOINT (remove after first use) -------------------
@swagger_auto_schema(
    method='get',
    operation_description="Get list of users (admin-only)"
)
@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_users(request):
    """Returns a list of all users (id + username). Only for admin/staff."""
    users = User.objects.all().values('id', 'username')
    return Response(list(users))

def create_admin(request):
    call_command("migrate")

    if not User.objects.filter(username="admin").exists():
        User.objects.create_superuser("admin", "admin@example.com", "admin123")
        return HttpResponse("✅ Superuser created successfully.")
    return HttpResponse("ℹ️ Superuser already exists.")

@csrf_exempt
@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=["username"],
        properties={"username": openapi.Schema( type=openapi.TYPE_STRING,example="rock_llama" )}
    ),
    operation_description="Get LeetCode user's submission calendar by username",
    responses={200: 'Returns date-wise submission counts'},
)
@api_view(["POST"])
def leetcode_proxy(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get("username")

            if not username:
                return JsonResponse({'error': 'Username is required'}, status=400)

            # Build GraphQL query internally
            graphql_query = {
                "query": """
                    query userProblemsSolved($username: String!) {
                        matchedUser(username: $username) {
                            userCalendar {
                                submissionCalendar
                            }
                        }
                    }
                """,
                "variables": {
                    "username": username
                }
            }

            headers = {
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com',
                'Origin': 'https://leetcode.com',
                'User-Agent': 'Mozilla/5.0',
            }

            res = requests.post(
                'https://leetcode.com/graphql/',
                json=graphql_query,
                headers=headers
            )

            try:
                r = make_date_count_response(
                    res.json()['data']['matchedUser']['userCalendar']['submissionCalendar']
                )
                return JsonResponse(r, safe=False)
            except ValueError:
                return JsonResponse(
                    {'error': 'Invalid JSON in response', 'text': res.text},
                    status=502
                )

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Only POST method allowed'}, status=405)

'''
curl --location 'http://localhost:8000/api/leetcode' \
                --header 'Content-Type: application/json' \
                         --data '{
"query": "query userProblemsSolved($username: String!) { matchedUser(username: $username) { userCalendar { submissionCalendar } } }",
"variables": { "username": "rock_llama" }
}'
'''

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    return Response({"message": f"Hello, {request.user.username}!"})


@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=["username", "password"],
        properties={
            "username": openapi.Schema(type=openapi.TYPE_STRING, example="anushree"),
            "password": openapi.Schema(type=openapi.TYPE_STRING, example="5671")
        }
    ),
    operation_description="Register a new user",
    responses={200: 'Returns success response'},
)
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({'detail': 'Username and password required'}, status=400)
    if User.objects.filter(username=username).exists():
        return Response({'detail': 'Username already exists'}, status=400)
    User.objects.create_user(username=username, password=password)
    return Response({'message': 'User created successfully'}, status=201)
