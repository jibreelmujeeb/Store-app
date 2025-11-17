# POS System API Documentation

## Overview

The POS System API is a RESTful backend service built with Python's `http.server` module, providing comprehensive functionality for a Point of Sale system. It uses MySQL for data persistence and JWT (JSON Web Tokens) for authentication.

## Base URL
```
http://localhost:5000
```

## Authentication

### JWT Token Usage
All endpoints except authentication require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Token Expiration
Tokens expire after 24 hours. Implement token refresh logic in your frontend application.

---

## API Endpoints

### 1. Authentication Endpoints

#### Register User
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "business_name": "string (required)",
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully"
}
```

**Error Responses:**
- `400`: Missing required fields
- `409`: User already exists
- `500`: Server error

#### Login User
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "jwt_token_string",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Error Responses:**
- `400`: Missing required fields
- `401`: Invalid credentials
- `500`: Server error

---

### 2. Product Management

#### Get All Products
**Endpoint:** `GET /api/products`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Cappuccino",
      "category": "Drinks",
      "price": 1500.00,
      "stock": 50,
      "created_at": "2024-01-01T10:00:00Z"
    }
  ]
}
```

#### Get Product by ID
**Endpoint:** `GET /api/products/{id}`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "product": {
    "id": 1,
    "name": "Cappuccino",
    "category": "Drinks",
    "price": 1500.00,
    "stock": 50,
    "created_at": "2024-01-01T10:00:00Z"
  }
}
```

**Error Responses:**
- `404`: Product not found

#### Create Product
**Endpoint:** `POST /api/products`

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "name": "string (required)",
  "category": "string (optional)",
  "price": "number (required)",
  "stock": "number (optional, default: 0)"
}
```

**Response (201):**
```json
{
  "message": "Product created successfully"
}
```

#### Update Product
**Endpoint:** `PUT /api/products/{id}`

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "name": "string (required)",
  "category": "string (optional)",
  "price": "number (required)",
  "stock": "number (optional)"
}
```

**Response (200):**
```json
{
  "message": "Product updated successfully"
}
```

#### Delete Product
**Endpoint:** `DELETE /api/products/{id}`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Product deleted successfully"
}
```

---

### 3. Customer Management

#### Get All Customers
**Endpoint:** `GET /api/customers`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "customers": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "created_at": "2024-01-01T10:00:00Z"
    }
  ]
}
```

#### Get Customer by ID
**Endpoint:** `GET /api/customers/{id}`

#### Create Customer
**Endpoint:** `POST /api/customers`

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (optional)",
  "phone": "string (optional)"
}
```

#### Update Customer
**Endpoint:** `PUT /api/customers/{id}`

#### Delete Customer
**Endpoint:** `DELETE /api/customers/{id}`

---

### 4. Order Management

#### Get All Orders
**Endpoint:** `GET /api/orders`

**Response (200):**
```json
{
  "orders": [
    {
      "id": 1,
      "invoice_id": "INV-ABC123",
      "customer_id": 1,
      "customer_name": "John Doe",
      "total": 3000.00,
      "status": "Paid",
      "payment_method": "Cash",
      "created_at": "2024-01-01T10:00:00Z"
    }
  ]
}
```

#### Get Order by ID
**Endpoint:** `GET /api/orders/{id}`

**Response (200):**
```json
{
  "order": {
    "id": 1,
    "invoice_id": "INV-ABC123",
    "customer_id": 1,
    "customer_name": "John Doe",
    "total": 3000.00,
    "status": "Paid",
    "payment_method": "Cash",
    "created_at": "2024-01-01T10:00:00Z",
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "product_name": "Cappuccino",
        "quantity": 2,
        "price": 1500.00
      }
    ]
  }
}
```

#### Create Order
**Endpoint:** `POST /api/orders`

**Request Body:**
```json
{
  "customer_id": "number (optional)",
  "items": [
    {
      "product_id": "number (required)",
      "quantity": "number (optional, default: 1)"
    }
  ],
  "payment_method": "string (optional, default: 'Cash')",
  "status": "string (optional, default: 'Paid')"
}
```

**Response (201):**
```json
{
  "message": "Order created successfully",
  "order_id": 1,
  "invoice_id": "INV-ABC123"
}
```

#### Update Order Status
**Endpoint:** `PUT /api/orders/status/{id}`

**Request Body:**
```json
{
  "status": "string (required)"
}
```

#### Delete Order
**Endpoint:** `DELETE /api/orders/{id}`

---

### 5. Staff Management

#### Get All Staff
**Endpoint:** `GET /api/staff`

**Response (200):**
```json
{
  "staff": [
    {
      "id": 1,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "Cashier",
      "salary": 30000.00,
      "status": "Active",
      "created_at": "2024-01-01T10:00:00Z"
    }
  ]
}
```

#### Create Staff
**Endpoint:** `POST /api/staff`

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "role": "string (optional, default: 'Cashier')",
  "salary": "number (optional)"
}
```

#### Update Staff
**Endpoint:** `PUT /api/staff/{id}`

#### Delete Staff
**Endpoint:** `DELETE /api/staff/{id}`

---

### 6. Expense Management

#### Get All Expenses
**Endpoint:** `GET /api/expenses`

**Response (200):**
```json
{
  "expenses": [
    {
      "id": 1,
      "name": "Office Supplies",
      "category": "Office",
      "amount": 5000.00,
      "date": "2024-01-01",
      "created_at": "2024-01-01T10:00:00Z"
    }
  ]
}
```

#### Create Expense
**Endpoint:** `POST /api/expenses`

**Request Body:**
```json
{
  "name": "string (required)",
  "category": "string (optional)",
  "amount": "number (required)",
  "date": "string (required, format: YYYY-MM-DD)"
}
```

#### Update Expense
**Endpoint:** `PUT /api/expenses/{id}`

#### Delete Expense
**Endpoint:** `DELETE /api/expenses/{id}`

---

### 7. Supplier Management

#### Get All Suppliers
**Endpoint:** `GET /api/suppliers`

**Response (200):**
```json
{
  "suppliers": [
    {
      "id": 1,
      "name": "ABC Supplies Ltd",
      "phone": "+1234567890",
      "email": "contact@abc.com",
      "created_at": "2024-01-01T10:00:00Z"
    }
  ]
}
```

#### Create Supplier
**Endpoint:** `POST /api/suppliers`

**Request Body:**
```json
{
  "name": "string (required)",
  "phone": "string (optional)",
  "email": "string (optional)"
}
```

#### Update Supplier
**Endpoint:** `PUT /api/suppliers/{id}`

#### Delete Supplier
**Endpoint:** `DELETE /api/suppliers/{id}`

---

### 8. Reports & Analytics

#### Dashboard Statistics
**Endpoint:** `GET /api/reports/dashboard`

**Response (200):**
```json
{
  "today_sales": 82450.00,
  "total_stock": 1284,
  "total_customers": 342,
  "monthly_revenue": 1200000.00
}
```

#### Sales Chart Data
**Endpoint:** `GET /api/reports/sales-chart`

**Response (200):**
```json
{
  "sales_data": [
    {
      "month": "2024-01",
      "revenue": 150000.00
    }
  ]
}
```

#### Top Products
**Endpoint:** `GET /api/reports/top-products`

**Response (200):**
```json
{
  "top_products": [
    {
      "name": "Cappuccino",
      "sales": 150
    }
  ]
}
```

---

### 9. Settings Management

#### Get Settings
**Endpoint:** `GET /api/settings`

**Response (200):**
```json
{
  "settings": {
    "id": 1,
    "business_name": "POS System",
    "business_email": "admin@example.com",
    "business_phone": "+1234567890",
    "business_address": "123 Main St",
    "tax_rate": 7.5,
    "currency": "NGN"
  }
}
```

#### Update Settings
**Endpoint:** `PUT /api/settings`

**Request Body:**
```json
{
  "business_name": "string (optional)",
  "business_email": "string (optional)",
  "business_phone": "string (optional)",
  "business_address": "string (optional)",
  "tax_rate": "number (optional)",
  "currency": "string (optional)"
}
```

---

### 10. Notifications

#### Get All Notifications
**Endpoint:** `GET /api/notifications`

**Response (200):**
```json
{
  "notifications": [
    {
      "id": 1,
      "type": "low-stock",
      "message": "Low stock alert: Cappuccino (3 left)",
      "is_read": false,
      "created_at": "2024-01-01T10:00:00Z"
    }
  ]
}
```

#### Create Notification
**Endpoint:** `POST /api/notifications`

**Request Body:**
```json
{
  "type": "string (required)",
  "message": "string (required)"
}
```

#### Mark as Read
**Endpoint:** `PUT /api/notifications/read/{id}`

#### Delete Notification
**Endpoint:** `DELETE /api/notifications/{id}`

#### Check Low Stock
**Endpoint:** `POST /api/notifications/check-low-stock`

**Response (200):**
```json
{
  "message": "Checked low stock, 2 notifications created"
}
```

---

## Error Response Format

All error responses follow this format:
```json
{
  "error": "Error message description"
}
```

## HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (invalid/missing token)
- `404`: Not Found
- `409`: Conflict (duplicate resource)
- `500`: Internal Server Error

## Rate Limiting

Currently no rate limiting is implemented. Consider implementing it for production use.

## CORS

CORS is enabled for all origins during development. Configure appropriately for production.

## Data Types

- **Strings**: Text data
- **Numbers**: Integer or float values
- **Booleans**: true/false values
- **Dates**: ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)

## Database Schema

The API uses MySQL with the following main tables:
- `users` - User authentication
- `products` - Product inventory
- `customers` - Customer information
- `orders` - Order headers
- `order_items` - Order line items
- `staff` - Staff members
- `expenses` - Business expenses
- `suppliers` - Supplier contacts
- `notifications` - System notifications
- `settings` - System configuration

## Security Considerations

1. Always use HTTPS in production
2. Store JWT tokens securely (localStorage with httpOnly cookies recommended)
3. Implement token refresh mechanism
4. Validate all input data
5. Use prepared statements (already implemented)
6. Change default SECRET_KEY in production
7. Implement proper logging
8. Add request size limits
9. Consider API versioning for future updates
