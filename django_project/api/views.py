from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import requests
import json
from .logic import make_date_count_response
from rest_framework.decorators import api_view
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

username_param = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=["query", "variables"],
    properties={
        "query": openapi.Schema(type=openapi.TYPE_STRING, example="""
            query userProblemsSolved($username: String!) {
                matchedUser(username: $username) {
                    userCalendar {
                        submissionCalendar
                    }
                }
            }
        """),
        "variables": openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "username": openapi.Schema(type=openapi.TYPE_STRING, example="rock_llama")
            }
        ),
    },
)


@csrf_exempt
@swagger_auto_schema(
    method='post',
    request_body=username_param,
    operation_description="Post a LeetCode GraphQL query to get the user's submission calendar",
    responses={200: 'Returns date-wise submission counts'},
)
@api_view(["POST"])
def leetcode_proxy(request):
    if request.method == 'POST':
        try:
            req_data = json.loads(request.body)
            headers = {
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com',
                'Origin': 'https://leetcode.com',
                'User-Agent': 'Mozilla/5.0',
            }

            res = requests.post(
                'https://leetcode.com/graphql/',
                json=req_data,
                headers=headers
            )

            try:
                print("RESPONSE",str(res))
                r=make_date_count_response(res.json()['data']['matchedUser']['userCalendar']['submissionCalendar'])
                return JsonResponse(json.dumps(r), safe=False)
            except ValueError:
                return JsonResponse({'error': 'Invalid JSON in response', 'text': res.text}, status=502)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)

'''
curl --location 'http://localhost:8000/api/leetcode' \
                --header 'Content-Type: application/json' \
                         --data '{
"query": "query userProblemsSolved($username: String!) { matchedUser(username: $username) { userCalendar { submissionCalendar } } }",
"variables": { "username": "rock_llama" }
}'
'''
