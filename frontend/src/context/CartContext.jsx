import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "./AppContext";

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
    const { visitorID, token, backendUrl } = useContext(AppContext); // Global app state
    const [cart, setCart] = useState([]); // Cart items
    const [totalPrice, setTotalPrice] = useState(0); // Total price
    const [error, setError] = useState(null); // Error state for handling API issues

    // Check if the user is logged in via token
    const isLoggedIn = !!token;

    // Generate headers dynamically based on user or visitor status
    const getHeaders = () => {
        return {
            Authorization: isLoggedIn
                ? `Bearer ${token}` // Token for logged-in users
                : `Bearer ${visitorID}`, // visitorID for guest users
        };
    };

    // Fetch the cart from the backend
    const fetchCart = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/cart`, { headers: getHeaders() });
            setCart(data.cart.items || []); // Update cart state
            setTotalPrice(data.cart.totalPrice || 0); // Update total price
        } catch (error) {
            console.error("CartContext - Error fetching cart:", error);
            setCart([]); // Reset local cart state on failure
            setTotalPrice(0);
        }
    };

    // Add an item to the cart
    const addToCart = async (item) => {
        try {
            await axios.post(
                `${backendUrl}/api/cart/add`,
                { itemId: item.itemId }, // Send itemId to backend
                { headers: getHeaders() }
            );
            await fetchCart(); // Re-fetch the cart
        } catch (error) {
            console.error("CartContext - Error adding to cart:", error);
        }
    };

    // Remove an item from the cart
    const removeFromCart = async (itemId) => {
        try {
            await axios.post(
                `${backendUrl}/api/cart/remove`,
                { itemId }, // Send itemId to backend
                { headers: getHeaders() }
            );
            await fetchCart(); // Re-fetch the cart
        } catch (error) {
            console.error("CartContext - Error removing from cart:", error);
        }
    };

    // Update the quantity of an item in the cart
    const updateCartQuantity = async (itemId, quantity) => {
        try {
            await axios.post(
                `${backendUrl}/api/cart/update`,
                { itemId, quantity }, // Send itemId and new quantity
                { headers: getHeaders() }
            );
            await fetchCart(); // Re-fetch the cart
        } catch (error) {
            console.error("CartContext - Error updating cart quantity:", error);
        }
    };

    // Clear the entire cart
    const clearCart = async () => {
        try {
            await axios.post(`${backendUrl}/api/cart/clear`, {}, { headers: getHeaders() });
            setCart([]); // Reset local cart state
            setTotalPrice(0); // Reset the total price
        } catch (error) {
            console.error("CartContext - Error clearing cart:", error);
        }
    };

    // Automatically fetch cart when visitorID or token changes
    useEffect(() => {
        if (visitorID || token) {
            fetchCart();
        }
    }, [visitorID, token]);

    return (
        <CartContext.Provider
            value={{
                cart,
                totalPrice,
                addToCart,
                removeFromCart,
                updateCartQuantity,
                clearCart,
                fetchCart,
                error,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};