import React, { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        // Load the cart from localStorage on initialization
        const storedCart = localStorage.getItem("cart");
        return storedCart ? JSON.parse(storedCart) : [];
    });

    const [totalPrice, setTotalPrice] = useState(() => {
        // Calculate the total price from localStorage’s cart if available
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            const parsedCart = JSON.parse(storedCart);
            return parsedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        }
        return 0;
    });

    // Helper function to calculate total price
    const calculateTotal = (cartItems) => {
        const newTotal = cartItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );
        setTotalPrice(newTotal);
    };

    // Add an item to the cart
    const addToCart = (item) => {
        const existingItem = cart.find((cartItem) => cartItem._id === item._id);

        let updatedCart;
        if (existingItem) {
            updatedCart = cart.map((cartItem) =>
                cartItem._id === item._id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            );
        } else {
            updatedCart = [...cart, { ...item, quantity: 1 }];
        }

        setCart(updatedCart);
        calculateTotal(updatedCart);

        // Save updated cart to localStorage
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // Remove an item from the cart
    const removeFromCart = (itemId) => {
        const updatedCart = cart.filter((cartItem) => cartItem._id !== itemId);
        setCart(updatedCart);
        calculateTotal(updatedCart);

        // Save updated cart to localStorage
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // Update the quantity of an item in the cart
    const updateCartQuantity = (itemId, quantity) => {
        const updatedCart = cart.map((cartItem) =>
            cartItem._id === itemId ? { ...cartItem, quantity } : cartItem
        );
        setCart(updatedCart);
        calculateTotal(updatedCart);

        // Save updated cart to localStorage
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // Clear the cart
    const clearCart = () => {
        setCart([]);
        setTotalPrice(0);

        // Clear cart from localStorage
        localStorage.removeItem("cart");
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                totalPrice,
                addToCart,
                removeFromCart,
                updateCartQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;