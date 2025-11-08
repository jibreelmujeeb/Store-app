import json
from db import execute_query
from datetime import datetime, timedelta

class ReportsHandler:
    @staticmethod
    def get_dashboard_stats():
        """Get dashboard statistics"""
        try:
            # Today's sales
            today_sales = execute_query("""
                SELECT COALESCE(SUM(total), 0) as today_sales
                FROM orders
                WHERE DATE(created_at) = CURDATE() AND status = 'Paid'
            """, fetch=True)[0]['today_sales']

            # Total products in stock
            total_stock = execute_query("""
                SELECT COALESCE(SUM(stock), 0) as total_stock FROM products
            """, fetch=True)[0]['total_stock']

            # Total customers
            total_customers = execute_query("""
                SELECT COUNT(*) as total_customers FROM customers
            """, fetch=True)[0]['total_customers']

            # Monthly revenue (current month)
            monthly_revenue = execute_query("""
                SELECT COALESCE(SUM(total), 0) as monthly_revenue
                FROM orders
                WHERE MONTH(created_at) = MONTH(CURDATE())
                AND YEAR(created_at) = YEAR(CURDATE())
                AND status = 'Paid'
            """, fetch=True)[0]['monthly_revenue']

            return {
                'today_sales': float(today_sales),
                'total_stock': int(total_stock),
                'total_customers': int(total_customers),
                'monthly_revenue': float(monthly_revenue)
            }, 200

        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def get_sales_chart():
        """Get sales data for chart (last 6 months)"""
        try:
            sales_data = execute_query("""
                SELECT
                    DATE_FORMAT(created_at, '%Y-%m') as month,
                    SUM(total) as revenue
                FROM orders
                WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
                AND status = 'Paid'
                GROUP BY DATE_FORMAT(created_at, '%Y-%m')
                ORDER BY month
            """, fetch=True)

            return {'sales_data': sales_data}, 200

        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def get_top_products():
        """Get top selling products"""
        try:
            top_products = execute_query("""
                SELECT
                    p.name,
                    SUM(oi.quantity) as sales
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                JOIN orders o ON oi.order_id = o.id
                WHERE o.status = 'Paid'
                GROUP BY p.id, p.name
                ORDER BY sales DESC
                LIMIT 5
            """, fetch=True)

            return {'top_products': top_products}, 200

        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def get_recent_activity():
        """Get recent activity"""
        try:
            # Recent orders
            recent_orders = execute_query("""
                SELECT
                    CONCAT('Sale completed - INV-', invoice_id) as message,
                    created_at as time
                FROM orders
                WHERE status = 'Paid'
                ORDER BY created_at DESC
                LIMIT 3
            """, fetch=True)

            # Recent stock updates (mock data since we don't track updates)
            activities = recent_orders

            return {'activities': activities}, 200

        except Exception as e:
            return {'error': str(e)}, 500
