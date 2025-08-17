
import React, { useState } from "react";

 const Checkout = ({ cart }) => {
  const [form, setForm] = useState({ name: "", email: "", address: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Order submitted:", { ...form, cart });
    alert("Order submitted! (Check console)");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        ></textarea>
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}
export default Checkout;
