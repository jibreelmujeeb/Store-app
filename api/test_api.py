import requests
import json
import time

BASE_URL = 'http://localhost:5000'

def print_response(response):
    print(f'Status: {response.status_code}')
    try:
        data = response.json()
        print(f'Response: {json.dumps(data, indent=2)}')
    except:
        print(f'Raw response: {response.text}')
    print('-' * 50)

def test_auth():
    print('=== TESTING AUTH ===')
    
    # Test register
    register_data = {
        'business_name': 'Test Store',
        'email': 'test@example.com',
        'password': 'testpass123'
    }
    print('1. Register new user:')
    resp = requests.post(f'{BASE_URL}/api/auth/register', json=register_data)
    print_response(resp)
    
    # Test login
    print('2. Login:')
    login_data = {'email': 'test@example.com', 'password': 'testpass123'}
    resp = requests.post(f'{BASE_URL}/api/auth/login', json=login_data)
    print_response(resp)
    
    token = resp.json().get('token') if resp.status_code == 200 else None
    headers = {'Authorization': f'Bearer {token}'} if token else {}
    
    # Test invalid login
    print('3. Invalid login:')
    resp = requests.post(f'{BASE_URL}/api/auth/login', json={'email': 'wrong@test.com', 'password': 'wrong'})
    print_response(resp)
    
    return token, headers

def test_products(headers):
    print('=== TESTING PRODUCTS ===')
    
    # Create
    print('1. Create product:')
    prod_data = {'name': 'Test Product', 'category': 'Test', 'price': 10.99, 'stock': 100}
    resp = requests.post(f'{BASE_URL}/api/products', json=prod_data, headers=headers)
    print_response(resp)
    
    prod_id = resp.json().get('id') if resp.status_code == 201 else None
    
    if prod_id:
        # Get all
        print('2. Get all products:')
        resp = requests.get(f'{BASE_URL}/api/products', headers=headers)
        print_response(resp)
        
        # Get by ID
        print('3. Get product by ID:')
        resp = requests.get(f'{BASE_URL}/api/products/{prod_id}', headers=headers)
        print_response(resp)
        
        # Update
        print('4. Update product:')
        update_data = {'name': 'Updated Product', 'price': 15.99}
        resp = requests.put(f'{BASE_URL}/api/products/{prod_id}', json=update_data, headers=headers)
        print_response(resp)
        
        # Delete
        print('5. Delete product:')
        resp = requests.delete(f'{BASE_URL}/api/products/{prod_id}', headers=headers)
        print_response(resp)

def test_customers(headers):
    print('=== TESTING CUSTOMERS ===')
    
    # Create
    cust_data = {'name': 'Test Customer', 'email': 'cust@test.com', 'phone': '123456'}
    resp = requests.post(f'{BASE_URL}/api/customers', json=cust_data, headers=headers)
    print_response(resp)
    
    cust_id = resp.json().get('id') if 'id' in resp.json() else None
    
    if cust_id:
        resp = requests.get(f'{BASE_URL}/api/customers/{cust_id}', headers=headers)
        print_response(resp)

# Run tests
if __name__ == '__main__':
    print('API Test Suite - Ensure server running on http://localhost:5000')
    print('Install deps: pip install requests')
    print()
    
    token, headers = test_auth()
    
    if token:
        test_products(headers)
        test_customers(headers)
        
        # Reports
        print('=== TESTING REPORTS ===')
        resp = requests.get(f'{BASE_URL}/api/reports/dashboard', headers=headers)
        print_response(resp)
        
        print('=== TESTING SETTINGS ===')
        resp = requests.get(f'{BASE_URL}/api/settings', headers=headers)
        print_response(resp)
        
        print()
        print('ALL TESTS COMPLETE!')
        print('Test user created: test@example.com / testpass123 (delete if needed)')
    else:
        print('Auth failed - cannot test protected routes')
