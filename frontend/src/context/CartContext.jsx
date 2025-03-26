import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "./AppContext";
import { getVisitorId } from "../utils/cartUtils"; // Utility to generate/retrieve visitor IDs

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
    const { visitorID, token, backendUrl } = useContext(AppContext);
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    console.log("CartContext - visitorID:", visitorID);
    console.log("CartContext - token:", token);

    // Check login status
    const isLoggedIn = !!token;
    console.log("CartContext - isLoggedIn:", isLoggedIn);

    // Generate headers for requests
    const getHeaders = () => {
        const headers = {
            Authorization: isLoggedIn ? `Bearer ${token}` : undefined, // Token for logged-in users
            "visitor-id": !isLoggedIn ? (visitorID || getVisitorId()) : undefined, // Visitor ID for guests
        };
        console.log("CartContext - Request headers:", headers);
        return headers;
    };

    // Function to fetch the cart
    const fetchCart = async () => {
        console.log("CartContext - Fetching cart data...");
        try {
            const { data } = await axios.get(`${backendUrl}/api/cart`, { headers: getHeaders() });
            console.log("CartContext - Cart data fetched:", data);
            setCart(data.cart.items || []); // Update cart items
            setTotalPrice(data.cart.totalPrice || 0); // Update total price
        } catch (error) {
            console.error("CartContext - Error fetching cart:", error);
            setCart([]); // Reset cart state
            setTotalPrice(0); // Reset total price
        }
    };

    // Add an item to the cart
    const addToCart = async (item) => {
        console.log("CartContext - Adding item to cart:", item);
        try {
            await axios.post(`${backendUrl}/api/cart/add`, item, { headers: getHeaders() });
            console.log("CartContext - Item added successfully.");
            await fetchCart(); // Refresh cart after addition
        } catch (error) {
            console.error("CartContext - Error adding to cart:", error);

            if (error.response) {
                console.error("CartContext - Server Error:", error.response.data.message); // Log server errors
            }
        }
    };

    // Remove an item from the cart
    const removeFromCart = async (itemId) => {
        console.log("CartContext - Removing item from cart:", itemId);
        try {
            await axios.post(`${backendUrl}/api/cart/remove`, { itemId }, { headers: getHeaders() });
            console.log("CartContext - Item removed successfully.");
            await fetchCart(); // Refresh cart after removal
        } catch (error) {
            console.error("CartContext - Error removing from cart:", error);
        }
    };

    // Update the quantity of an item in the cart
    const updateCartQuantity = async (itemId, quantity) => {
        console.log(`CartContext - Updating item (${itemId}) quantity to:`, quantity);
        try {
            await axios.post(
                `${backendUrl}/api/cart/update`,
                { itemId, quantity },
                { headers: getHeaders() }
            );
            console.log("CartContext - Item quantity updated successfully.");
            await fetchCart(); // Refresh cart after update
        } catch (error) {
            console.error("CartContext - Error updating cart quantity:", error);
        }
    };

    // Initial fetch of cart data on component mount
    useEffect(() => {
        fetchCart();
    }, [visitorID, token]);

    return (
        <CartContext.Provider
            value={{
                cart,
                totalPrice,
                addToCart,
                removeFromCart,
                updateCartQuantity,
                fetchCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};