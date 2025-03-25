import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";

const Cart = () => {
  const { cart, totalPrice, removeFromCart, updateCartQuantity } = useContext(CartContext);

  return (
      <div className="max-w-4xl mx-auto my-10 p-4 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

        {cart.length > 0 ? (
            cart.map((item) => (
                <div key={item._id} className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p>Price: ₹{item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>

                  <div>
                    <button
                        onClick={() => updateCartQuantity(item._id, item.quantity - 1)}
                        className="px-2 py-1 text-sm bg-gray-200 rounded"
                        disabled={item.quantity === 1}
                    >
                      -
                    </button>
                    <button
                        onClick={() => updateCartQuantity(item._id, item.quantity + 1)}
                        className="px-2 py-1 text-sm bg-gray-200 rounded"
                    >
                      +
                    </button>
                    <button
                        onClick={() => removeFromCart(item._id)}
                        className="ml-4 text-sm text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
            ))
        ) : (
            <p>Your cart is empty.</p>
        )}

        {cart.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-bold">Total: ₹{totalPrice}</h2>
            </div>
        )}
      </div>
  );
};

export default Cart;