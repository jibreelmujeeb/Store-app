import json
from db import execute_query

class SuppliersHandler:
    @staticmethod
    def get_all():
        """Get all suppliers"""
        try:
            suppliers = execute_query("SELECT * FROM suppliers ORDER BY created_at DESC", fetch=True)
            return {'suppliers': suppliers}, 200
        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def get_by_id(supplier_id):
        """Get supplier by ID"""
        try:
            supplier = execute_query("SELECT * FROM suppliers WHERE id = %s", (supplier_id,), fetch=True)
            if not supplier:
                return {'error': 'Supplier not found'}, 404
            return {'supplier': supplier[0]}, 200
        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def create(data):
        """Create new supplier"""
        try:
            name = data.get('name')
            phone = data.get('phone')
            email = data.get('email')

            if not name:
                return {'error': 'Name is required'}, 400

            result = execute_query(
                "INSERT INTO suppliers (name, phone, email) VALUES (%s, %s, %s)",
                (name, phone, email)
            )

            if result:
                return {'message': 'Supplier created successfully'}, 201
            else:
                return {'error': 'Failed to create supplier'}, 500

        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def update(supplier_id, data):
        """Update supplier"""
        try:
            name = data.get('name')
            phone = data.get('phone')
            email = data.get('email')

            if not name:
                return {'error': 'Name is required'}, 400

            result = execute_query(
                "UPDATE suppliers SET name = %s, phone = %s, email = %s WHERE id = %s",
                (name, phone, email, supplier_id)
            )

            if result:
                return {'message': 'Supplier updated successfully'}, 200
            else:
                return {'error': 'Supplier not found or no changes made'}, 404

        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def delete(supplier_id):
        """Delete supplier"""
        try:
            result = execute_query("DELETE FROM suppliers WHERE id = %s", (supplier_id,))

            if result:
                return {'message': 'Supplier deleted successfully'}, 200
            else:
                return {'error': 'Supplier not found'}, 404

        except Exception as e:
            return {'error': str(e)}, 500
