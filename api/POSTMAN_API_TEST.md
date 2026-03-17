# Quick Browser/Postman API Testing Guide

## 1. Browser Testing (GET only)
Server must be running: `python api/server.py`

**Dashboard example** (after login):
```
http://localhost:5000/api/reports/dashboard
```
→ Browser shows raw JSON (needs token? Use dev tools)

**Auth endpoints work directly**:
```
http://localhost:5000/api/auth/login  # GET 405 (use POST)
```

## 2. Postman / Insomnia (Recommended)
Download [Postman](https://postman.com)

### Auth First:
1. **POST** `http://localhost:5000/api/auth/register`
   ```
   Body (JSON):
   {"business_name": "Test", "email": "test2@test.com", "password": "123"}
   ```
2. **POST** `http://localhost:5000/api/auth/login` (same body w/o business_name)
   → Copy **token** from response

### Protected Calls:
**Headers**: 
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Examples**:
- **GET** `http://localhost:5000/api/products`
- **POST** `http://localhost:5000/api/products`
  ```
  Body: {"name": "Coffee", "price": 5.99, "stock": 50}
  ```
- **GET** `http://localhost:5000/api/reports/dashboard`
- **GET** `http://localhost:5000/api/settings`

## 3. curl (Terminal)
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123"}'

# Products (use token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/products
```

## 4. Python Test Script (Full)
```
python api/test_api.py
```
Auto-tests everything!

## Common Errors
- **401**: No/missing token
- **Connection refused**: Server not running
- **409**: User exists (skip register)

**Start Here**: Run server → Postman register/login → Test products!

All endpoints from `API_DOCUMENTATION.md` work this way.
