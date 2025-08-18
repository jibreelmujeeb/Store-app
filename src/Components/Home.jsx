
import React from "react";
import products from "./products";
const Home = ({ addToCart }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 shadow rounded">
            <img src={product.image} alt={product.name} className="mb-2" />
            <h3 className="font-semibold">{product.name}</h3>
            <p>${product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Home;