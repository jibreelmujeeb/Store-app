import json
from http.server import BaseHTTPRequestHandler
from db import execute_query
from auth import hash_password, check_password, generate_token

class AuthHandler:
    @staticmethod
    def register(data):
        """Handle user registration"""
        try:
            business_name = data.get('business_name')
            email = data.get('email')
            password = data.get('password')

            if not all([business_name, email, password]):
                return {'error': 'Business name, email, and password are required'}, 400

            # Check if user already exists
            existing = execute_query(
                "SELECT id FROM users WHERE email = %s",
                (email,),
                fetch=True
            )

            if existing:
                return {'error': 'User with this email already exists'}, 409

            # Hash password and create user
            password_hash = hash_password(password)

            result = execute_query(
                "INSERT INTO users (business_name, email, password_hash) VALUES (%s, %s, %s)",
                (business_name, email, password_hash)
            )

            if result:
                return {'message': 'User registered successfully'}, 201
            else:
                return {'error': 'Failed to register user'}, 500

        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def login(data):
        """Handle user login"""
        try:
            email = data.get('email')
            password = data.get('password')

            if not all([email, password]):
                return {'error': 'Email and password are required'}, 400

            # Get user from database
            user = execute_query(
                "SELECT id, email, password_hash FROM users WHERE email = %s",
                (email,),
                fetch=True
            )

            if not user:
                return {'error': 'Invalid credentials'}, 401

            user = user[0]

            # Check password
            if not check_password(password, user['password_hash']):
                return {'error': 'Invalid credentials'}, 401

            # Generate token
            token = generate_token(user['id'], user['email'])

            return {
                'message': 'Login successful',
                'token': token,
                'user': {
                    'id': user['id'],
                    'email': user['email']
                }
            }, 200

        except Exception as e:
            return {'error': str(e)}, 500
