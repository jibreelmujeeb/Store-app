# POS System Backend API

A Python-based REST API backend for a Point of Sale (POS) system using MySQL database.

## Features

- **Authentication**: JWT-based login and registration
- **Product Management**: CRUD operations for inventory
- **Customer Management**: Customer database with order history
- **Order Processing**: Complete order management with items
- **Staff Management**: Employee management system
- **Expense Tracking**: Business expense recording
- **Supplier Management**: Supplier contact database
- **Reports & Analytics**: Sales reports and dashboard statistics
- **Notifications**: System notifications and alerts
- **Settings**: Configurable business settings

## Prerequisites

- Python 3.8+
- MySQL Server (XAMPP recommended)
- Required Python packages (see requirements.txt)

## Installation

1. **Install Dependencies**:
   ```bash
   cd api
   pip install -r requirements.txt
   ```

2. **Setup Database**:
   - Start MySQL server (via XAMPP control panel)
   - Run the database creation script:
   ```bash
   python create_db.py
   ```

3. **Configure Environment**:
   - Edit `.env` file if needed (default settings should work with XAMPP)

4. **Start the Server**:
   ```bash
   python server.py
   ```

   The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication (No Auth Required)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Products (Auth Required)
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Customers (Auth Required)
- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Orders (Auth Required)
- `GET /api/orders` - Get all orders
- `GET /api/orders/{id}` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/status/{id}` - Update order status
- `DELETE /api/orders/{id}` - Delete order

### Staff (Auth Required)
- `GET /api/staff` - Get all staff
- `GET /api/staff/{id}` - Get staff member by ID
- `POST /api/staff` - Create new staff member
- `PUT /api/staff/{id}` - Update staff member
- `DELETE /api/staff/{id}` - Delete staff member

### Expenses (Auth Required)
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/{id}` - Get expense by ID
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense

### Suppliers (Auth Required)
- `GET /api/suppliers` - Get all suppliers
- `GET /api/suppliers/{id}` - Get supplier by ID
- `POST /api/suppliers` - Create new supplier
- `PUT /api/suppliers/{id}` - Update supplier
- `DELETE /api/suppliers/{id}` - Delete supplier

### Reports (Auth Required)
- `GET /api/reports/dashboard` - Dashboard statistics
- `GET /api/reports/sales-chart` - Sales chart data
- `GET /api/reports/top-products` - Top selling products

### Settings (Auth Required)
- `GET /api/settings` - Get system settings
- `PUT /api/settings` - Update system settings

### Notifications (Auth Required)
- `GET /api/notifications` - Get all notifications
- `POST /api/notifications` - Create notification
- `PUT /api/notifications/read/{id}` - Mark as read
- `DELETE /api/notifications/{id}` - Delete notification
- `POST /api/notifications/check-low-stock` - Check low stock alerts

## Authentication

All endpoints except authentication require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Database Schema

### Tables
- `users` - User accounts
- `products` - Product inventory
- `customers` - Customer database
- `orders` - Order records
- `order_items` - Order line items
- `staff` - Staff members
- `expenses` - Business expenses
- `suppliers` - Supplier contacts
- `notifications` - System notifications
- `settings` - System configuration

## Sample API Usage

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "business_name": "My Coffee Shop",
    "email": "admin@coffeeshop.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@coffeeshop.com",
    "password": "password123"
  }'
```

### Create Product (with auth token)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Cappuccino",
    "category": "Drinks",
    "price": 1500.00,
    "stock": 50
  }'
```

## Frontend Integration

The React frontend should be updated to use these API endpoints instead of local state. Key changes needed:

1. Add API service functions for each endpoint
2. Implement authentication state management
3. Replace local state with API calls
4. Add loading states and error handling
5. Store JWT token in localStorage

## Security Notes

- Change the `SECRET_KEY` in `.env` for production
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Add input validation and sanitization
- Consider implementing refresh tokens for better security

## Development

- The server runs on port 5000 by default
- CORS is enabled for development
- Error logging is basic - consider adding proper logging
- No caching implemented - consider adding Redis for production

## Troubleshooting

1. **Database Connection Issues**: Ensure MySQL is running and credentials are correct
2. **Port Already in Use**: Change PORT in .env file
3. **Import Errors**: Ensure all dependencies are installed
4. **CORS Issues**: Check browser console for CORS-related errors

## License

This project is for educational purposes.
