import json
from db import execute_query

class ProductsHandler:
    @staticmethod
    def get_all():
        """Get all products"""
        try:
            products = execute_query("SELECT * FROM products ORDER BY created_at DESC", fetch=True)
            return {'products': products}, 200
        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def get_by_id(product_id):
        """Get product by ID"""
        try:
            product = execute_query("SELECT * FROM products WHERE id = %s", (product_id,), fetch=True)
            if not product:
                return {'error': 'Product not found'}, 404
            return {'product': product[0]}, 200
        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def create(data):
        """Create new product"""
        try:
            name = data.get('name')
            category = data.get('category', '')
            price = data.get('price')
            stock = data.get('stock', 0)

            if not name or price is None:
                return {'error': 'Name and price are required'}, 400

            result = execute_query(
                "INSERT INTO products (name, category, price, stock) VALUES (%s, %s, %s, %s)",
                (name, category, price, stock)
            )

            if result:
                return {'message': 'Product created successfully'}, 201
            else:
                return {'error': 'Failed to create product'}, 500

        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def update(product_id, data):
        """Update product"""
        try:
            name = data.get('name')
            category = data.get('category')
            price = data.get('price')
            stock = data.get('stock')

            if not name or price is None:
                return {'error': 'Name and price are required'}, 400

            result = execute_query(
                "UPDATE products SET name = %s, category = %s, price = %s, stock = %s WHERE id = %s",
                (name, category, price, stock, product_id)
            )

            if result:
                return {'message': 'Product updated successfully'}, 200
            else:
                return {'error': 'Product not found or no changes made'}, 404

        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def delete(product_id):
        """Delete product"""
        try:
            result = execute_query("DELETE FROM products WHERE id = %s", (product_id,))

            if result:
                return {'message': 'Product deleted successfully'}, 200
            else:
                return {'error': 'Product not found'}, 404

        except Exception as e:
            return {'error': str(e)}, 500
