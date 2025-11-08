import json
from db import execute_query

class SettingsHandler:
    @staticmethod
    def get_settings():
        """Get system settings"""
        try:
            settings = execute_query("SELECT * FROM settings WHERE id = 1", fetch=True)
            if not settings:
                # Create default settings if none exist
                execute_query("""
                    INSERT INTO settings (id, business_name, tax_rate, currency)
                    VALUES (1, 'POS System', 7.5, 'NGN')
                """)
                settings = execute_query("SELECT * FROM settings WHERE id = 1", fetch=True)

            return {'settings': settings[0]}, 200

        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def update_settings(data):
        """Update system settings"""
        try:
            business_name = data.get('business_name')
            business_email = data.get('business_email')
            business_phone = data.get('business_phone')
            business_address = data.get('business_address')
            tax_rate = data.get('tax_rate')
            currency = data.get('currency')

            result = execute_query("""
                UPDATE settings
                SET business_name = %s, business_email = %s, business_phone = %s,
                    business_address = %s, tax_rate = %s, currency = %s
                WHERE id = 1
            """, (business_name, business_email, business_phone, business_address, tax_rate, currency))

            if result:
                return {'message': 'Settings updated successfully'}, 200
            else:
                return {'error': 'Failed to update settings'}, 500

        except Exception as e:
            return {'error': str(e)}, 500
