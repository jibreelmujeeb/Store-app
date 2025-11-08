import json
from db import execute_query, execute_many
import uuid

class OrdersHandler:
    @staticmethod
    def get_all():
        """Get all orders with customer info"""
        try:
            orders = execute_query("""
                SELECT o.*, c.name as customer_name
                FROM orders o
                LEFT JOIN customers c ON o.customer_id = c.id
                ORDER BY o.created_at DESC
            """, fetch=True)
            return {'orders': orders}, 200
        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def get_by_id(order_id):
        """Get order by ID with items"""
        try:
            order = execute_query("""
                SELECT o.*, c.name as customer_name
                FROM orders o
                LEFT JOIN customers c ON o.customer_id = c.id
                WHERE o.id = %s
            """, (order_id,), fetch=True)

            if not order:
                return {'error': 'Order not found'}, 404

            order = order[0]

            # Get order items
            items = execute_query("""
                SELECT oi.*, p.name as product_name
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = %s
            """, (order_id,), fetch=True)

            order['items'] = items
            return {'order': order}, 200

        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def create(data):
        """Create new order with items"""
        try:
            customer_id = data.get('customer_id')
            items = data.get('items', [])
            payment_method = data.get('payment_method', 'Cash')
            status = data.get('status', 'Paid')

            if not items:
                return {'error': 'Order must have at least one item'}, 400

            # Generate invoice ID
            invoice_id = f"INV-{uuid.uuid4().hex[:8].upper()}"

            # Calculate total
            total = 0
            order_items = []

            for item in items:
                product_id = item.get('product_id')
                quantity = item.get('quantity', 1)

                # Get product price
                product = execute_query("SELECT price FROM products WHERE id = %s", (product_id,), fetch=True)
                if not product:
                    return {'error': f'Product {product_id} not found'}, 404

                price = product[0]['price']
                total += price * quantity
                order_items.append((product_id, quantity, price))

            # Create order
            order_result = execute_query(
                "INSERT INTO orders (invoice_id, customer_id, total, status, payment_method) VALUES (%s, %s, %s, %s, %s)",
                (invoice_id, customer_id, total, status, payment_method)
            )

            if not order_result:
                return {'error': 'Failed to create order'}, 500

            # Get order ID
            order_id = execute_query("SELECT LAST_INSERT_ID() as id", fetch=True)[0]['id']

            # Insert order items
            if order_items:
                items_query = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (%s, %s, %s, %s)"
                items_params = [(order_id, pid, qty, price) for pid, qty, price in order_items]
                execute_many(items_query, items_params)

            return {
                'message': 'Order created successfully',
                'order_id': order_id,
                'invoice_id': invoice_id
            }, 201

        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def update_status(order_id, data):
        """Update order status"""
        try:
            status = data.get('status')
            if not status:
                return {'error': 'Status is required'}, 400

            result = execute_query(
                "UPDATE orders SET status = %s WHERE id = %s",
                (status, order_id)
            )

            if result:
                return {'message': 'Order status updated successfully'}, 200
            else:
                return {'error': 'Order not found'}, 404

        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def delete(order_id):
        """Delete order"""
        try:
            result = execute_query("DELETE FROM orders WHERE id = %s", (order_id,))

            if result:
                return {'message': 'Order deleted successfully'}, 200
            else:
                return {'error': 'Order not found'}, 404

        except Exception as e:
            return {'error': str(e)}, 500
