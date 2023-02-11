import functions_framework
from flask import json

ALLOWED_DOMAIN = "*"


@functions_framework.http
def hello(request):

    request_data = request.get_json()
    url = request_data.get('url')

    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': ALLOWED_DOMAIN,
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': ALLOWED_DOMAIN,
        'Content-Type': 'application/json'
    }

    response_body = {'url': url}
    response = json.dumps(response_body)

    return (response, 200, headers)
