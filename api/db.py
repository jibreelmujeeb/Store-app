import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    """Establish and return a database connection"""
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            user=os.getenv('DB_USER', 'root'),
            password=os.getenv('DB_PASSWORD', ''),
            database=os.getenv('DB_NAME', 'pos_system')
        )
        return connection
    except Error as e:
        print(f"Database connection error: {e}")
        return None

def execute_query(query, params=None, fetch=False):
    """Execute a query and optionally fetch results"""
    connection = get_db_connection()
    if not connection:
        return None

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(query, params or ())

        if fetch:
            result = cursor.fetchall()
        else:
            connection.commit()
            result = cursor.rowcount

        cursor.close()
        return result

    except Error as e:
        print(f"Query execution error: {e}")
        return None

    finally:
        if connection.is_connected():
            connection.close()

def execute_many(query, params_list):
    """Execute multiple queries with different parameters"""
    connection = get_db_connection()
    if not connection:
        return None

    try:
        cursor = connection.cursor()
        cursor.executemany(query, params_list)
        connection.commit()
        result = cursor.rowcount
        cursor.close()
        return result

    except Error as e:
        print(f"Batch query execution error: {e}")
        return None

    finally:
        if connection.is_connected():
            connection.close()
