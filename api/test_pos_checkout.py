import requests
import json

BASE_URL = 'http://localhost:5000'

def print_response(response):
    print(f'Status: {response.status_code}')
    try:
        data = response.json()
        print(f'Response: {json.dumps(data, indent=2)}')
    except:
        print(f'Raw: {response.text}')
    print('-' * 60)

print('=== POS CHECKOUT TEST ===')
print('Ensure server running: python api/server.py')

# Step 1: Login (use existing test user)
headers = {}
login_data = {'email': 'test@example.com', 'password': 'testpass123'}
resp = requests.post(f'{BASE_URL}/api/auth/login', json=login_data)
print_response(resp)

token = resp.json().get('token') if resp.status_code == 200 else None
headers['Authorization'] = f'Bearer {token}'

if not token:
    print('Login failed - checkout test aborted')
    exit()

# Step 2: Create test products/customers if needed
print('Creating test data...')

# Customer
cust_resp = requests.post(f'{BASE_URL}/api/customers', 
    json={'name': 'Checkout Test Customer', 'phone': '123'}, 
    headers=headers)
print_response(cust_resp)
cust_id = cust_resp.json().get('id', 1) if cust_resp.status_code == 201 else 1

# Products
prod1_resp = requests.post(f'{BASE_URL}/api/products', 
    json={'name': 'Coffee', 'price': 5.0, 'stock': 10, 'category': 'Drinks'}, 
    headers=headers)
print_response(prod1_resp)
prod1_id = prod1_resp.json().get('id', 1)

prod2_resp = requests.post(f'{BASE_URL}/api/products', 
    json={'name': 'Croissant', 'price': 3.5, 'stock': 5, 'category': 'Bakery'}, 
    headers=headers)
print_response(prod2_resp)
prod2_id = prod2_resp.json().get('id', 2)

# Step 3: POS Checkout - Create Order
print('=== SIMULATING POS CHECKOUT ===')
checkout_data = {
    "customer_id": cust_id,
    "items": [
        {"product_id": prod1_id, "quantity": 2},
        {"product_id": prod2_id, "quantity": 1}
    ],
    "payment_method": "Cash",
    "status": "Paid"
}

resp = requests.post(f'{BASE_URL}/api/orders', json=checkout_data, headers=headers)
print_response(resp)

order_id = resp.json().get('order_id') if resp.status_code == 201 else None

# Step 4: Verify Order
if order_id:
    print(f'=== VERIFY ORDER #{order_id} ===')
    resp = requests.get(f'{BASE_URL}/api/orders/{order_id}', headers=headers)
    print_response(resp)

print('\n✅ POS Checkout Test Complete!')
print('Real POS flow: Select products → POST /api/orders with items array → Get invoice_id')
