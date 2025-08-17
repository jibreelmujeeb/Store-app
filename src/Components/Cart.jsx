
import React from "react";

 const Cart = ({ cart, removeFromCart, updateQty }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white p-4 mb-2 shadow rounded"
            >
              <span>{item.name}</span>
              <span>${item.price}</span>
              <input
                type="number"
                min="1"
                value={item.qty}
                onChange={(e) => updateQty(item.id, parseInt(e.target.value))}
                className="w-16 border rounded px-2"
              />
              <button
                onClick={() => removeFromCart(item.id)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <h3 className="mt-4 font-bold">Total: ${total}</h3>
        </div>
      )}
    </div>
  );
}
export default Cart;
