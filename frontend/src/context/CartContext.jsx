// src/context/CartContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "./AppContext"; // Import AppContext to access global state
import { getVisitorId } from "../utils/cartUtils"; // Helper utility

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
    const { visitorID, token, backendUrl } = useContext(AppContext); // Access AppContext values
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    console.log("CartContext - visitorID:", visitorID); // Debug: Check the visitorID
    console.log("CartContext - token:", token); // Debug: Check the token

    // Check if the user is logged in or not
    const isLoggedIn = !!token;
    console.log("CartContext - isLoggedIn:", isLoggedIn); // Debug: Log login state

    // Function to generate authorization headers for requests
    const getHeaders = () => {
        const headers = {
            Authorization: isLoggedIn ? `Bearer ${token}` : undefined, // Use token if logged in
            "visitor-id": !isLoggedIn ? (visitorID || getVisitorId()) : undefined, // Use visitorID for guests
        };
        console.log("CartContext - Request headers:", headers); // Debug: Log headers
        return headers;
    };

    // Fetch the cart from the backend
    const fetchCart = async () => {
        console.log("CartContext - Fetching cart data..."); // Debug: Log fetchCart initiation
        try {
            const { data } = await axios.get(`${backendUrl}/api/cart`, { headers: getHeaders() });
            console.log("CartContext - Cart data fetched:", data); // Debug: Log fetched cart data
            setCart(data.cart.items || []);
            setTotalPrice(data.cart.totalPrice || 0);
        } catch (error) {
            console.error("CartContext - Error fetching cart:", error);
            setCart([]);
            setTotalPrice(0);
        }
    };

    // Add an item to the cart
    const addToCart = async (item) => {
        console.log("CartContext - Adding item to cart:", item); // Debug: Log item to be added
        try {
            await axios.post(`${backendUrl}/api/cart/add`, item, { headers: getHeaders() });
            console.log("CartContext - Item added successfully."); // Debug: Log success
            await fetchCart(); // Refresh cart data
        } catch (error) {
            console.error("CartContext - Error adding to cart:", error);

            if (error.response) {
                console.error("CartContext - Server Error:", error.response.data.message); // Debug server response
            }
        }
    };

    // Remove an item from the cart
    const removeFromCart = async (itemId) => {
        console.log("CartContext - Removing item from cart:", itemId); // Debug: Log item to be removed
        try {
            await axios.post(`${backendUrl}/api/cart/remove`, { itemId }, { headers: getHeaders() });
            console.log("CartContext - Item removed successfully."); // Debug: Log success
            await fetchCart(); // Refresh cart data
        } catch (error) {
            console.error("CartContext - Error removing from cart:", error);
        }
    };

    // Update the quantity of an item in the cart
    const updateCartQuantity = async (itemId, quantity) => {
        console.log(`CartContext - Updating item (${itemId}) quantity to:`, quantity); // Debug: Log update details
        try {
            await axios.post(
                `${backendUrl}/api/cart/update`,
                { itemId, quantity },
                { headers: getHeaders() }
            );
            console.log("CartContext - Item quantity updated successfully."); // Debug success
            await fetchCart(); // Refresh cart data
        } catch (error) {
            console.error("CartContext - Error updating cart quantity:", error);
        }
    };

    // Clear all items from the cart
    const clearCart = async () => {
        console.log("CartContext - Clearing the cart..."); // Debug: Log cart clearing action
        try {
            await axios.post(`${backendUrl}/api/cart/clear`, null, { headers: getHeaders() });
            console.log("CartContext - Cart cleared successfully."); // Debug success
            setCart([]);
            setTotalPrice(0);
        } catch (error) {
            console.error("CartContext - Error clearing cart:", error);
        }
    };

    // Fetch the cart on component mount or whenever the login state changes
    useEffect(() => {
        console.log("CartContext - Fetching cart on mount or state change..."); // Debug: Log initialization
        fetchCart();
    }, [isLoggedIn, visitorID]); // Re-fetch cart when the login or visitor state changes

    return (
        <CartContext.Provider
            value={{
                cart,
                totalPrice,
                addToCart,
                removeFromCart,
                updateCartQuantity,
                clearCart,
            }}>
            {children}
        </CartContext.Provider>
    );
};