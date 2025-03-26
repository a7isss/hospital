// src/context/CartContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { getVisitorId } from "../utils/cartUtils";

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const isLoggedIn = !!localStorage.getItem("token");
    const token = localStorage.getItem("token") || ""; // Always provide a fallback

    // Function to get authorization headers
    const getHeaders = () => ({
        Authorization: isLoggedIn ? `Bearer ${token}` : undefined,
        "visitor-id": !isLoggedIn ? getVisitorId() : undefined,
    });

    // Fetch the cart from the backend
    const fetchCart = async () => {
        try {
            const { data } = await axios.get("/api/cart", { headers: getHeaders() });
            setCart(data.cart.items || []);
            setTotalPrice(data.cart.totalPrice || 0);
        } catch (error) {
            console.error("Error fetching cart:", error);
            setCart([]);
            setTotalPrice(0); // Reset the cart values
        }
    };

    // Add an item to the cart
    // CartContext.js or wherever `addToCart` is declared:
    const addToCart = async (item) => {
        try {
            // Add item to cart via backend API
            await axios.post("/api/cart/add", item, { headers: getHeaders() });

            // Fetch updated cart and update the state
            await fetchCart(); // Refresh cart data in CartContext
        } catch (error) {
            console.error("Error adding to cart:", error);

            // Handle specific error responses (optional)
            if (error.response) {
                console.error("Server Error:", error.response.data.message);
            }
        }
    };
    // Remove an item from the cart
    const removeFromCart = async (itemId) => {
        try {
            await axios.post("/api/cart/remove", { itemId }, { headers: getHeaders() });
            fetchCart(); // Refresh the cart
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    };

    // Update cart quantity
    const updateCartQuantity = async (itemId, quantity) => {
        try {
            await axios.post("/api/cart/update", { itemId, quantity }, { headers: getHeaders() });
            fetchCart(); // Refresh the cart
        } catch (error) {
            console.error("Error updating cart quantity:", error);
        }
    };

    // Clear all items from the cart
    const clearCart = async () => {
        try {
            await axios.post("/api/cart/clear", null, { headers: getHeaders() });
            setCart([]);
            setTotalPrice(0);
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    };

    // Fetch the cart on app load or whenever login state changes
   // useEffect(() => {
      //  fetchCart();
 //   }, [isLoggedIn]);

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