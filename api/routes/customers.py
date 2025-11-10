import json
from db import execute_query

class CustomersHandler:
    @staticmethod
    def get_all():
        """Get all customers"""
        try:
            customers = execute_query("SELECT * FROM customers ORDER BY created_at DESC", fetch=True)
            return {'customers': customers}, 200
        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def get_by_id(customer_id):
        """Get customer by ID"""
        try:
            customer = execute_query("SELECT * FROM customers WHERE id = %s", (customer_id,), fetch=True)
            if not customer:
                return {'error': 'Customer not found'}, 404
            return {'customer': customer[0]}, 200
        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def create(data):
        """Create new customer"""
        try:
            name = data.get('name')
            email = data.get('email')
            phone = data.get('phone')

            if not name:
                return {'error': 'Name is required'}, 400

            result = execute_query(
                "INSERT INTO customers (name, email, phone) VALUES (%s, %s, %s)",
                (name, email, phone)
            )

            if result:
                return {'message': 'Customer created successfully'}, 201
            else:
                return {'error': 'Failed to create customer'}, 500

        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def update(customer_id, data):
        """Update customer"""
        try:
            name = data.get('name')
            email = data.get('email')
            phone = data.get('phone')

            if not name:
                return {'error': 'Name is required'}, 400

            result = execute_query(
                "UPDATE customers SET name = %s, email = %s, phone = %s WHERE id = %s",
                (name, email, phone, customer_id)
            )

            if result:
                return {'message': 'Customer updated successfully'}, 200
            else:
                return {'error': 'Customer not found or no changes made'}, 404

        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def delete(customer_id):
        """Delete customer"""
        try:
            result = execute_query("DELETE FROM customers WHERE id = %s", (customer_id,))

            if result:
                return {'message': 'Customer deleted successfully'}, 200
            else:
                return {'error': 'Customer not found'}, 404

        except Exception as e:
            return {'error': str(e)}, 500
