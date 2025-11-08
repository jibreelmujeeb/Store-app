# Backend Development TODO

## Database Setup
- [ ] Create MySQL database schema (create_db.py)
- [ ] Define tables: users, products, customers, orders, order_items, staff, expenses, suppliers, notifications, settings

## Dependencies
- [ ] Create requirements.txt with: mysql-connector-python, PyJWT, bcrypt (for hashing passwords)

## Core Files
- [ ] Create db.py for database connection and queries
- [ ] Create auth.py for JWT authentication and password hashing
- [ ] Create server.py with HTTP server and route handling
- [ ] Create routes/ directory with separate files for each entity (users.py, products.py, etc.)

## API Endpoints
- [ ] Authentication: /login, /register, /logout
- [ ] Products: CRUD operations (/products)
- [ ] Customers: CRUD (/customers)
- [ ] Orders: CRUD (/orders), including order_items
- [ ] Staff: CRUD (/staff)
- [ ] Expenses: CRUD (/expenses)
- [ ] Suppliers: CRUD (/suppliers)
- [ ] Notifications: CRUD (/notifications)
- [ ] Settings: CRUD (/settings)
- [ ] Reports: GET /reports (aggregated data)

## Security
- [ ] Implement JWT middleware for protected routes
- [ ] Require login for all operations except login/register

## README
- [ ] Create detailed README.md with setup instructions, API docs, database schema, and usage

## Testing
- [ ] Test database connection
- [ ] Test authentication
- [ ] Test sample API endpoints
