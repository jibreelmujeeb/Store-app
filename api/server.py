import json
import os
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
from auth import verify_token
from routes.auth import AuthHandler
from routes.products import ProductsHandler
from routes.customers import CustomersHandler
from routes.orders import OrdersHandler
from routes.staff import StaffHandler
from routes.expenses import ExpensesHandler
from routes.suppliers import SuppliersHandler
from routes.reports import ReportsHandler
from routes.settings import SettingsHandler
from routes.notifications import NotificationsHandler

class POSAPIHandler(BaseHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.routes = {
            # Auth routes (no auth required)
            'POST': {
                '/api/auth/register': self.handle_register,
                '/api/auth/login': self.handle_login,
            },
            # Protected routes
            'GET': {
                '/api/products': self.handle_get_products,
                '/api/customers': self.handle_get_customers,
                '/api/orders': self.handle_get_orders,
                '/api/staff': self.handle_get_staff,
                '/api/expenses': self.handle_get_expenses,
                '/api/suppliers': self.handle_get_suppliers,
                '/api/notifications': self.handle_get_notifications,
                '/api/reports/dashboard': self.handle_get_dashboard,
                '/api/reports/sales-chart': self.handle_get_sales_chart,
                '/api/reports/top-products': self.handle_get_top_products,
                '/api/settings': self.handle_get_settings,
            },
            'POST': {
                '/api/products': self.handle_create_product,
                '/api/customers': self.handle_create_customer,
                '/api/orders': self.handle_create_order,
                '/api/staff': self.handle_create_staff,
                '/api/expenses': self.handle_create_expense,
                '/api/suppliers': self.handle_create_supplier,
                '/api/notifications': self.handle_create_notification,
                '/api/notifications/check-low-stock': self.handle_check_low_stock,
            },
            'PUT': {
                '/api/products': self.handle_update_product,
                '/api/customers': self.handle_update_customer,
                '/api/orders/status': self.handle_update_order_status,
                '/api/staff': self.handle_update_staff,
                '/api/expenses': self.handle_update_expense,
                '/api/suppliers': self.handle_update_supplier,
                '/api/settings': self.handle_update_settings,
                '/api/notifications/read': self.handle_mark_notification_read,
            },
            'DELETE': {
                '/api/products': self.handle_delete_product,
                '/api/customers': self.handle_delete_customer,
                '/api/orders': self.handle_delete_order,
                '/api/staff': self.handle_delete_staff,
                '/api/expenses': self.handle_delete_expense,
                '/api/suppliers': self.handle_delete_supplier,
                '/api/notifications': self.handle_delete_notification,
            }
        }
        super().__init__(*args, **kwargs)

    def do_GET(self):
        self.handle_request('GET')

    def do_POST(self):
        self.handle_request('POST')

    def do_PUT(self):
        self.handle_request('PUT')

    def do_DELETE(self):
        self.handle_request('DELETE')

    def handle_request(self, method):
        try:
            # Parse URL
            parsed_url = urlparse(self.path)
            path = parsed_url.path
            query_params = parse_qs(parsed_url.query)

            # Get route handler
            route_handlers = self.routes.get(method, {})
            handler = None

            # Check for exact match first
            if path in route_handlers:
                handler = route_handlers[path]
            else:
                # Check for pattern matches (e.g., /api/products/123)
                for route_pattern, route_handler in route_handlers.items():
                    if path.startswith(route_pattern + '/'):
                        handler = route_handler
                        break

            if not handler:
                self.send_error_response(404, 'Endpoint not found')
                return

            # Check authentication for protected routes
            if method != 'POST' or not path.startswith('/api/auth'):
                auth_result = self.check_auth()
                if not auth_result['authenticated']:
                    self.send_json_response(401, {'error': 'Authentication required'})
                    return

            # Get request body for POST/PUT
            data = None
            if method in ['POST', 'PUT']:
                content_length = int(self.headers.get('Content-Length', 0))
                if content_length > 0:
                    body = self.rfile.read(content_length).decode('utf-8')
                    try:
                        data = json.loads(body)
                    except json.JSONDecodeError:
                        self.send_json_response(400, {'error': 'Invalid JSON'})
                        return

            # Extract ID from URL if needed
            resource_id = None
            if '/' in path[len('/api/'):]:
                parts = path.split('/')
                if len(parts) >= 4:
                    resource_id = parts[3]

            # Call handler
            result, status_code = handler(data, resource_id, query_params)
            self.send_json_response(status_code, result)

        except Exception as e:
            self.send_json_response(500, {'error': str(e)})

    def check_auth(self):
        """Check if request is authenticated"""
        auth_header = self.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return {'authenticated': False}

        token = auth_header[7:]  # Remove 'Bearer ' prefix
        user_data = verify_token(token)

        if user_data:
            return {'authenticated': True, 'user': user_data}
        return {'authenticated': False}

    def send_json_response(self, status_code, data):
        """Send JSON response"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def send_error_response(self, status_code, message):
        """Send error response"""
        self.send_json_response(status_code, {'error': message})

    # Auth handlers
    def handle_register(self, data, resource_id=None, query_params=None):
        return AuthHandler.register(data)

    def handle_login(self, data, resource_id=None, query_params=None):
        return AuthHandler.login(data)

    # Product handlers
    def handle_get_products(self, data=None, resource_id=None, query_params=None):
        if resource_id:
            return ProductsHandler.get_by_id(resource_id)
        return ProductsHandler.get_all()

    def handle_create_product(self, data, resource_id=None, query_params=None):
        return ProductsHandler.create(data)

    def handle_update_product(self, data, resource_id=None, query_params=None):
        if not resource_id:
            return {'error': 'Product ID required'}, 400
        return ProductsHandler.update(resource_id, data)

    def handle_delete_product(self, data=None, resource_id=None, query_params=None):
        if not resource_id:
            return {'error': 'Product ID required'}, 400
        return ProductsHandler.delete(resource_id)

    # Customer handlers
    def handle_get_customers(self, data=None, resource_id=None, query_params=None):
        if resource_id:
            return CustomersHandler.get_by_id(resource_id)
        return CustomersHandler.get_all()

    def handle_create_customer(self, data, resource_id=None, query_params=None):
        return CustomersHandler.create(data)

    def handle_update_customer(self, data, resource_id=None, query_params=None):
        if not resource_id:
            return {'error': 'Customer ID required'}, 400
        return CustomersHandler.update(resource_id, data)

    def handle_delete_customer(self, data=None, resource_id=None, query_params=None):
        if not resource_id:
            return {'error': 'Customer ID required'}, 400
        return CustomersHandler.delete(resource_id)

    # Order handlers
    def handle_get_orders(self, data=None, resource_id=None, query_params=None):
        if resource_id:
            return OrdersHandler.get_by_id(resource_id)
        return OrdersHandler.get_all()

    def handle_create_order(self, data, resource_id=None, query_params=None):
        return OrdersHandler.create(data)

    def handle_update_order_status(self, data, resource_id=None, query_params=None):
        if not resource_id:
            return {'error': 'Order ID required'}, 400
        return OrdersHandler.update_status(resource_id, data)

    def handle_delete_order(self, data=None, resource_id=None, query_params=None):
        if not resource_id:
            return {'error': 'Order ID required'}, 400
        return OrdersHandler.delete(resource_id)

    # Staff handlers
    def handle_get_staff(self, data=None, resource_id=None, query_params=None):
        if resource_id:
            return StaffHandler.get_by_id(resource_id)
        return StaffHandler.get_all()

    def handle_create_staff(self, data, resource_id=None, query_params=None):
        return StaffHandler.create(data)

    def handle_update_staff(self, data, resource_id=None, query_params=None):
        if not resource_id:
            return {'error': 'Staff ID required'}, 400
        return StaffHandler.update(resource_id, data)

    def handle_delete_staff(self, data=None, resource_id=None, query_params=None):
        if not resource_id:
            return {'error': 'Staff ID required'}, 400
        return StaffHandler.delete(resource_id)

    # Expense handlers
    def handle_get_expenses(self, data=None, resource_id=None, query_params=None):
        if resource_id:
            return ExpensesHandler.get_by_id(resource_id)
        return ExpensesHandler.get_all()

    def handle_create_expense(self, data, resource_id=None, query_params=None):
        return ExpensesHandler.create(data)

    def handle_update_expense(self, data, resource_id=None, query_params=None):
        if not resource_id:
            return {'error': 'Expense ID required'}, 400
        return ExpensesHandler.update(resource_id, data)

    def handle_delete_expense(self, data=None, resource_id=None, query_params=None):
        if not resource_id:
            return {'error': 'Expense ID required'}, 400
        return ExpensesHandler.delete(resource_id)

    # Supplier handlers
    def handle_get_suppliers(self, data=None, resource_id=None, query_params=None):
        if resource_id:
            return SuppliersHandler.get_by_id(resource_id)
        return SuppliersHandler.get_all()

    def handle_create_supplier(self, data, resource_id=None, query_params=None):
        return SuppliersHandler.create(data)

    def handle_update_supplier(self, data, resource_id=None, query_params=None):
        if not resource_id:
            return {'error': 'Supplier ID required'}, 400
        return SuppliersHandler.update(resource_id, data)

    def handle_delete_supplier(self, data=None, resource_id=None, query_params=None):
        if not resource_id:
            return {'error': 'Supplier ID required'}, 400
        return SuppliersHandler.delete(resource_id)

    # Report handlers
    def handle_get_dashboard(self, data=None, resource_id=None, query_params=None):
        return ReportsHandler.get_dashboard_stats()

    def handle_get_sales_chart(self, data=None, resource_id=None, query_params=None):
        return ReportsHandler.get_sales_chart()

    def handle_get_top_products(self, data=None, resource_id=None, query_params=None):
        return ReportsHandler.get_top_products()

    # Settings handlers
    def handle_get_settings(self, data=None, resource_id=None, query_params=None):
        return SettingsHandler.get_settings()

    def handle_update_settings(self, data, resource_id=None, query_params=None):
        return SettingsHandler.update_settings(data)

    # Notification handlers
    def handle_get_notifications(self, data=None, resource_id=None, query_params=None):
        return NotificationsHandler.get_all()

    def handle_create_notification(self, data, resource_id=None, query_params=None):
        return NotificationsHandler.create(data)

    def handle_mark_notification_read(self, data, resource_id=None, query_params=None):
        if not resource_id:
            return {'error': 'Notification ID required'}, 400
        return NotificationsHandler.mark_as_read(resource_id)

    def handle_delete_notification(self, data=None, resource_id=None, query_params=None):
        if not resource_id:
            return {'error': 'Notification ID required'}, 400
        return NotificationsHandler.delete(resource_id)

    def handle_check_low_stock(self, data=None, resource_id=None, query_params=None):
        return NotificationsHandler.check_low_stock()

def run_server(port=5000):
    """Run the HTTP server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, POSAPIHandler)
    print(f'Server running on port {port}')
    httpd.serve_forever()

if __name__ == '__main__':
    import os
    from dotenv import load_dotenv
    load_dotenv()

    port = int(os.getenv('PORT', 5000))
    run_server(port)
