// src/context/CartContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { getVisitorId } from "../utils/cartUtils";

export const CartContext = createContext();

const CartContextProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const isLoggedIn = !!localStorage.getItem("token");
    const token = localStorage.getItem("token");

    // Fetch cart from backend
    const fetchCart = async () => {
        try {
            const headers = {
                Authorization: isLoggedIn ? `Bearer ${token}` : undefined,
                "visitor-id": !isLoggedIn ? getVisitorId() : undefined,
            };

            const { data } = await axios.get("/api/cart", { headers });
            setCart(data.cart.items || []);
            setTotalPrice(data.cart.totalPrice || 0);
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    // Add item to cart
    const addToCart = async (item) => {
        try {
            const headers = {
                Authorization: isLoggedIn ? `Bearer ${token}` : undefined,
                "visitor-id": !isLoggedIn ? getVisitorId() : undefined,
            };

            await axios.post("/api/cart/add", item, { headers });
            fetchCart();
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    // Remove item from cart
    const removeFromCart = async (itemId) => {
        try {
            const headers = {
                Authorization: isLoggedIn ? `Bearer ${token}` : undefined,
                "visitor-id": !isLoggedIn ? getVisitorId() : undefined,
            };

            await axios.post("/api/cart/remove", { itemId }, { headers });
            fetchCart();
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    };

    // Update cart item quantity
    const updateCartQuantity = async (itemId, quantity) => {
        try {
            const headers = {
                Authorization: isLoggedIn ? `Bearer ${token}` : undefined,
                "visitor-id": !isLoggedIn ? getVisitorId() : undefined,
            };

            await axios.post("/api/cart/update", { itemId, quantity }, { headers });
            fetchCart();
        } catch (error) {
            console.error("Error updating cart quantity:", error);
        }
    };

    // Clear cart
    const clearCart = async () => {
        try {
            const headers = {
                Authorization: isLoggedIn ? `Bearer ${token}` : undefined,
                "visitor-id": !isLoggedIn ? getVisitorId() : undefined,
            };

            await axios.post("/api/cart/clear", null, { headers });
            setCart([]);
            setTotalPrice(0);
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    };

    // Fetch cart on mount or when login status changes
    useEffect(() => {
        fetchCart();
    }, [isLoggedIn]);

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

export { CartContextProvider };
export default CartContext;