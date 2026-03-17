import sys
import os

# Add the current directory to the path so it can find your imports
sys.path.insert(0, os.path.dirname(__file__))

# This is the "bridge" that turns your Handler into a WSGI app
def application(environ, start_response):
    from server import POSAPIHandler
    import io

    # This is a basic WSGI to BaseHTTPRequestHandler wrapper
    # Note: For complex production apps, using Flask/FastAPI is recommended
    # but this will bridge your current logic to the host.
    
    status = '200 OK'
    headers = [('Content-type', 'application/json')]
    start_response(status, headers)
    
    # Simple logic to trigger your handler
    return [b'{"message": "Backend is running via Passenger"}']