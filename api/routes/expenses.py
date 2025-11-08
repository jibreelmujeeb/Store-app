import json
from db import execute_query

class ExpensesHandler:
    @staticmethod
    def get_all():
        """Get all expenses"""
        try:
            expenses = execute_query("SELECT * FROM expenses ORDER BY date DESC", fetch=True)
            return {'expenses': expenses}, 200
        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def get_by_id(expense_id):
        """Get expense by ID"""
        try:
            expense = execute_query("SELECT * FROM expenses WHERE id = %s", (expense_id,), fetch=True)
            if not expense:
                return {'error': 'Expense not found'}, 404
            return {'expense': expense[0]}, 200
        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def create(data):
        """Create new expense"""
        try:
            name = data.get('name')
            category = data.get('category')
            amount = data.get('amount')
            date = data.get('date')

            if not all([name, amount, date]):
                return {'error': 'Name, amount, and date are required'}, 400

            result = execute_query(
                "INSERT INTO expenses (name, category, amount, date) VALUES (%s, %s, %s, %s)",
                (name, category, amount, date)
            )

            if result:
                return {'message': 'Expense created successfully'}, 201
            else:
                return {'error': 'Failed to create expense'}, 500

        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def update(expense_id, data):
        """Update expense"""
        try:
            name = data.get('name')
            category = data.get('category')
            amount = data.get('amount')
            date = data.get('date')

            if not all([name, amount, date]):
                return {'error': 'Name, amount, and date are required'}, 400

            result = execute_query(
                "UPDATE expenses SET name = %s, category = %s, amount = %s, date = %s WHERE id = %s",
                (name, category, amount, date, expense_id)
            )

            if result:
                return {'message': 'Expense updated successfully'}, 200
            else:
                return {'error': 'Expense not found or no changes made'}, 404

        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def delete(expense_id):
        """Delete expense"""
        try:
            result = execute_query("DELETE FROM expenses WHERE id = %s", (expense_id,))

            if result:
                return {'message': 'Expense deleted successfully'}, 200
            else:
                return {'error': 'Expense not found'}, 404

        except Exception as e:
            return {'error': str(e)}, 500
