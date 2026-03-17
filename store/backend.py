from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import json
from datetime import datetime, date
import os

app = Flask(__name__)
CORS(app)   # <-- NOW this is correct


# Load database config
with open('db_config.json') as f:
    db_config = json.load(f)

def get_db_connection():
    try:
        connection = mysql.connector.connect(**db_config)
        return connection
    except Error as e:
        print(f"Error connecting to database: {e}")
        return None

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM tbl_user WHERE useremail=%s AND userpassword=%s", (username, password))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user:
        return jsonify({'success': True, 'user': user})
    else:
        return jsonify({'success': False, 'message': 'Invalid credentials'})

@app.route('/api/products', methods=['GET'])
def get_products():
    search = request.args.get('search', '')
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500

    cursor = conn.cursor(dictionary=True)
    if search:
        query = "SELECT * FROM tbl_product WHERE product LIKE %s OR category LIKE %s ORDER BY product ASC"
        cursor.execute(query, (f'%{search}%', f'%{search}%'))
    else:
        cursor.execute("SELECT * FROM tbl_product ORDER BY product ASC")
    products = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify({'success': True, 'products': products})

@app.route('/api/products', methods=['POST'])
def add_product():
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500

    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO tbl_product (barcode, product, category, stock, purchaseprice, saleprice)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (data['barcode'], data['product'], data['category'], data['stock'], data['purchaseprice'], data['saleprice']))
        conn.commit()
        product_id = cursor.lastrowid
    except Error as e:
        conn.rollback()
        return jsonify({'success': False, 'message': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

    return jsonify({'success': True, 'product_id': product_id})

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500

    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE tbl_product SET barcode=%s, product=%s, category=%s, stock=%s, purchaseprice=%s, saleprice=%s
            WHERE pid=%s
        """, (data['barcode'], data['product'], data['category'], data['stock'], data['purchaseprice'], data['saleprice'], product_id))
        conn.commit()
    except Error as e:
        conn.rollback()
        return jsonify({'success': False, 'message': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

    return jsonify({'success': True})

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500

    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM tbl_product WHERE pid=%s", (product_id,))
        conn.commit()
    except Error as e:
        conn.rollback()
        return jsonify({'success': False, 'message': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

    return jsonify({'success': True})

@app.route('/api/categories', methods=['GET'])
def get_categories():
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM tbl_category ORDER BY category ASC")
    categories = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify({'success': True, 'categories': categories})

@app.route('/api/categories', methods=['POST'])
def add_category():
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500

    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO tbl_category (category) VALUES (%s)", (data['category'],))
        conn.commit()
        category_id = cursor.lastrowid
    except Error as e:
        conn.rollback()
        return jsonify({'success': False, 'message': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

    return jsonify({'success': True, 'category_id': category_id})

@app.route('/api/sales', methods=['GET'])
def get_sales():
    date_param = request.args.get('date', str(date.today()))
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500

    cursor = conn.cursor(dictionary=True)
    date_pattern = f"{date_param}%"
    cursor.execute("""
        SELECT d.order_date, d.product_name, d.rate, d.qty, d.saleprice, i.sales_by
        FROM tbl_invoice_details d
        JOIN tbl_invoice i ON d.invoice_id = i.id
        WHERE d.order_date LIKE %s
        ORDER BY d.order_date DESC
    """, (date_pattern,))
    sales = cursor.fetchall()
    cursor.close()
    conn.close()

    total_amount = sum(sale['saleprice'] for sale in sales)
    return jsonify({'success': True, 'sales': sales, 'total_amount': total_amount})

@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM tbl_expenses ORDER BY date DESC")
    expenses = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify({'success': True, 'expenses': expenses})

@app.route('/api/expenses', methods=['POST'])
def add_expense():
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500

    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO tbl_expenses (date, description, amount, receiver)
            VALUES (%s, %s, %s, %s)
        """, (data['date'], data['description'], data['amount'], data.get('receiver', 'N/A')))
        conn.commit()
        expense_id = cursor.lastrowid
    except Error as e:
        conn.rollback()
        return jsonify({'success': False, 'message': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

    return jsonify({'success': True, 'expense_id': expense_id})

@app.route('/api/checkout', methods=['POST'])
def checkout():
    data = request.json
    order_items = data['order_items']
    payment_type = data['payment_type']
    customer_name = data.get('customer_name', 'WALK-IN')
    discount = data.get('discount', 0)
    sgst = data.get('sgst', 0)
    cgst = data.get('cgst', 0)
    paid = data['paid']

    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500

    cursor = conn.cursor()
    try:
        # Calculate totals
        subtotal = sum(item['total'] for item in order_items)
        discount_amount = subtotal * (discount / 100)
        taxed_amount = subtotal - discount_amount
        sgst_amount = taxed_amount * (sgst / 100)
        cgst_amount = taxed_amount * (cgst / 100)
        total = taxed_amount + sgst_amount + cgst_amount

        # Insert invoice
        cursor.execute("""
            INSERT INTO tbl_invoice (order_date, subtotal, discount, sgst, cgst, total, payment_type, due, paid, sales_by, customer_name)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (datetime.now().strftime("%Y-%b-%d, at %I:%M%p ( %A )").lower().lstrip("0"), subtotal, discount, sgst, cgst, total, payment_type, total, paid, data.get('sales_by', 'admin'), customer_name))
        invoice_id = cursor.lastrowid

        # Insert invoice details and update stock
        for item in order_items:
            cursor.execute("""
                INSERT INTO tbl_invoice_details (invoice_id, barcode, product_id, product_name, qty, rate, saleprice, order_date)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (invoice_id, item.get('barcode', ''), item['product_id'], item['product_name'], item['quantity'], item['price'], item['total'], datetime.now().strftime("%Y-%b-%d, at %I:%M%p ( %A )").lower().lstrip("0")))

            cursor.execute("UPDATE tbl_product SET stock = stock - %s WHERE pid = %s", (item['quantity'], item['product_id']))

        conn.commit()
    except Error as e:
        conn.rollback()
        return jsonify({'success': False, 'message': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

    return jsonify({'success': True, 'invoice_id': invoice_id})

@app.route('/api/store_profile', methods=['GET'])
def get_store_profile():
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM tbl_storeinfo LIMIT 1")
    profile = cursor.fetchone()
    cursor.close()
    conn.close()

    return jsonify({'success': True, 'profile': profile})

@app.route('/api/store_profile', methods=['POST'])
def update_store_profile():
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500

    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id FROM tbl_storeinfo LIMIT 1")
        existing = cursor.fetchone()
        if existing:
            cursor.execute("""
                UPDATE tbl_storeinfo SET store_name=%s, phone_no=%s, address=%s, description=%s, descriptioni=%s, backup_path=%s
                WHERE id=%s
            """, (data['store_name'], data['phone_no'], data['address'], data['description'], data['descriptioni'], data.get('backup_path', ''), existing[0]))
        else:
            cursor.execute("""
                INSERT INTO tbl_storeinfo (store_name, phone_no, address, description, descriptioni, backup_path)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (data['store_name'], data['phone_no'], data['address'], data['description'], data['descriptioni'], data.get('backup_path', '')))
        conn.commit()
    except Error as e:
        conn.rollback()
        return jsonify({'success': False, 'message': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

    return jsonify({'success': True})

@app.route('/api/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT userid, username, useremail, role FROM tbl_user")
    users = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify({'success': True, 'users': users})

@app.route('/api/users', methods=['POST'])
def add_user():
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500

    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO tbl_user (username, useremail, userpassword, role)
            VALUES (%s, %s, %s, %s)
        """, (data['username'], data['useremail'], data['userpassword'], data['role']))
        conn.commit()
        user_id = cursor.lastrowid
    except Error as e:
        conn.rollback()
        return jsonify({'success': False, 'message': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

    return jsonify({'success': True, 'user_id': user_id})

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500

    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM tbl_user WHERE userid=%s", (user_id,))
        conn.commit()
    except Error as e:
        conn.rollback()
        return jsonify({'success': False, 'message': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
