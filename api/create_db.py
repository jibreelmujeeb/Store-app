import mysql.connector
from mysql.connector import Error

def create_database():
    try:
        # Connect to MySQL server (XAMPP default)
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password=''  # No password for XAMPP
        )

        if connection.is_connected():
            cursor = connection.cursor()

            # Create database if it doesn't exist
            cursor.execute("CREATE DATABASE IF NOT EXISTS pos_system")
            print("Database 'pos_system' created successfully")

            # Use the database
            cursor.execute("USE pos_system")

            # Create tables
            tables = [
                """
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    business_name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """,
                """
                CREATE TABLE IF NOT EXISTS products (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    category VARCHAR(100),
                    price DECIMAL(10,2) NOT NULL,
                    stock INT DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
                """,
                """
                CREATE TABLE IF NOT EXISTS customers (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255),
                    phone VARCHAR(20),
                    total_orders INT DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """,
                """
                CREATE TABLE IF NOT EXISTS orders (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    invoice_id VARCHAR(50) UNIQUE NOT NULL,
                    customer_id INT,
                    total DECIMAL(10,2) NOT NULL,
                    status ENUM('Paid', 'Pending', 'Cancelled') DEFAULT 'Paid',
                    payment_method VARCHAR(50) DEFAULT 'Cash',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
                )
                """,
                """
                CREATE TABLE IF NOT EXISTS order_items (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    order_id INT NOT NULL,
                    product_id INT NOT NULL,
                    quantity INT NOT NULL,
                    price DECIMAL(10,2) NOT NULL,
                    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
                )
                """,
                """
                CREATE TABLE IF NOT EXISTS staff (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    role VARCHAR(100) DEFAULT 'Cashier',
                    salary DECIMAL(10,2),
                    status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """,
                """
                CREATE TABLE IF NOT EXISTS expenses (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    category VARCHAR(100),
                    amount DECIMAL(10,2) NOT NULL,
                    date DATE NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """,
                """
                CREATE TABLE IF NOT EXISTS suppliers (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    phone VARCHAR(20),
                    email VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """,
                """
                CREATE TABLE IF NOT EXISTS notifications (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    type VARCHAR(50) NOT NULL,
                    message TEXT NOT NULL,
                    is_read BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """,
                """
                CREATE TABLE IF NOT EXISTS settings (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    business_name VARCHAR(255),
                    business_email VARCHAR(255),
                    business_phone VARCHAR(20),
                    business_address TEXT,
                    tax_rate DECIMAL(5,2) DEFAULT 7.5,
                    currency VARCHAR(10) DEFAULT 'NGN',
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
                """
            ]

            for table in tables:
                cursor.execute(table)
                print(f"Table created: {table.split('IF NOT EXISTS')[1].split('(')[0].strip()}")

            # Insert default settings
            cursor.execute("""
                INSERT IGNORE INTO settings (id, business_name, tax_rate, currency)
                VALUES (1, 'POS System', 7.5, 'NGN')
            """)

            connection.commit()
            print("All tables created successfully!")

    except Error as e:
        print(f"Error: {e}")

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection closed")

if __name__ == "__main__":
    create_database()
