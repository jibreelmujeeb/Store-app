import json
from db import execute_query

class StaffHandler:
    @staticmethod
    def get_all():
        """Get all staff members"""
        try:
            staff = execute_query("SELECT * FROM staff ORDER BY created_at DESC", fetch=True)
            return {'staff': staff}, 200
        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def get_by_id(staff_id):
        """Get staff member by ID"""
        try:
            staff = execute_query("SELECT * FROM staff WHERE id = %s", (staff_id,), fetch=True)
            if not staff:
                return {'error': 'Staff member not found'}, 404
            return {'staff': staff[0]}, 200
        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def create(data):
        """Create new staff member"""
        try:
            name = data.get('name')
            email = data.get('email')
            role = data.get('role', 'Cashier')
            salary = data.get('salary')

            if not name or not email:
                return {'error': 'Name and email are required'}, 400

            result = execute_query(
                "INSERT INTO staff (name, email, role, salary) VALUES (%s, %s, %s, %s)",
                (name, email, role, salary)
            )

            if result:
                return {'message': 'Staff member created successfully'}, 201
            else:
                return {'error': 'Failed to create staff member'}, 500

        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def update(staff_id, data):
        """Update staff member"""
        try:
            name = data.get('name')
            email = data.get('email')
            role = data.get('role')
            salary = data.get('salary')
            status = data.get('status')

            if not name or not email:
                return {'error': 'Name and email are required'}, 400

            result = execute_query(
                "UPDATE staff SET name = %s, email = %s, role = %s, salary = %s, status = %s WHERE id = %s",
                (name, email, role, salary, status, staff_id)
            )

            if result:
                return {'message': 'Staff member updated successfully'}, 200
            else:
                return {'error': 'Staff member not found or no changes made'}, 404

        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def delete(staff_id):
        """Delete staff member"""
        try:
            result = execute_query("DELETE FROM staff WHERE id = %s", (staff_id,))

            if result:
                return {'message': 'Staff member deleted successfully'}, 200
            else:
                return {'error': 'Staff member not found'}, 404

        except Exception as e:
            return {'error': str(e)}, 500
