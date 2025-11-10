import json
from db import execute_query

class NotificationsHandler:
    @staticmethod
    def get_all():
        """Get all notifications"""
        try:
            notifications = execute_query("SELECT * FROM notifications ORDER BY created_at DESC", fetch=True)
            return {'notifications': notifications}, 200
        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def create(data):
        """Create new notification"""
        try:
            type_ = data.get('type')
            message = data.get('message')

            if not all([type_, message]):
                return {'error': 'Type and message are required'}, 400

            result = execute_query(
                "INSERT INTO notifications (type, message) VALUES (%s, %s)",
                (type_, message)
            )

            if result:
                return {'message': 'Notification created successfully'}, 201
            else:
                return {'error': 'Failed to create notification'}, 500

        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def mark_as_read(notification_id):
        """Mark notification as read"""
        try:
            result = execute_query(
                "UPDATE notifications SET is_read = TRUE WHERE id = %s",
                (notification_id,)
            )

            if result:
                return {'message': 'Notification marked as read'}, 200
            else:
                return {'error': 'Notification not found'}, 404

        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def delete(notification_id):
        """Delete notification"""
        try:
            result = execute_query("DELETE FROM notifications WHERE id = %s", (notification_id,))

            if result:
                return {'message': 'Notification deleted successfully'}, 200
            else:
                return {'error': 'Notification not found'}, 404

        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def check_low_stock():
        """Check for low stock products and create notifications"""
        try:
            low_stock_products = execute_query("""
                SELECT name, stock FROM products WHERE stock <= 5
            """, fetch=True)

            notifications_created = 0
            for product in low_stock_products:
                # Check if notification already exists
                existing = execute_query("""
                    SELECT id FROM notifications
                    WHERE type = 'low-stock'
                    AND message LIKE %s
                    AND DATE(created_at) = CURDATE()
                """, (f"Low stock alert: {product['name']}%",), fetch=True)

                if not existing:
                    execute_query(
                        "INSERT INTO notifications (type, message) VALUES (%s, %s)",
                        ('low-stock', f"Low stock alert: {product['name']} ({product['stock']} left)")
                    )
                    notifications_created += 1

            return {'message': f'Checked low stock, {notifications_created} notifications created'}, 200

        except Exception as e:
            return {'error': str(e)}, 500
