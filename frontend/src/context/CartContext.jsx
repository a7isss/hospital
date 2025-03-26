import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "./AppContext";

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
    const { visitorID, token, backendUrl } = useContext(AppContext); // Access global app state from AppContext
    const [cart, setCart] = useState([]); // Cart items state
    const [totalPrice, setTotalPrice] = useState(0); // Total price of the cart items

    // Check if the user is logged in based on token
    const isLoggedIn = !!token;

    // Generate headers for requests (uses either token or visitorID)
    const getHeaders = () => {
        return {
            Authorization: isLoggedIn
                ? `Bearer ${token}` // Token for logged-in users
                : `Bearer ${visitorID}`, // Visitor ID for guest users
        };
    };

    // Function to fetch the cart from backend
    const fetchCart = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/cart`, { headers: getHeaders() });
            setCart(data.cart.items || []); // Update cart items
            setTotalPrice(data.cart.totalPrice || 0); // Update total price
        } catch (error) {
            console.error("CartContext - Error fetching cart:", error);
            setCart([]); // Reset cart if the fetch fails
            setTotalPrice(0); // Reset total price
        }
    };

    // Function to add an item to the cart
    const addToCart = async (item) => {
        try {
            console.log("CartContext - Adding item to cart:", item);
            await axios.post(
                `${backendUrl}/api/cart/add`,
                { itemId: item.itemId }, // Only itemId is sent to backend
                { headers: getHeaders() }
            );
            console.log("CartContext - Item added successfully.");
            await fetchCart(); // Fetch the updated cart after adding the item
        } catch (error) {
            console.error("CartContext - Error adding to cart:", error);
            if (error.response) {
                console.error("CartContext - Server Error:", error.response.data.message); // Log server errors
            }
        }
    };

    // Function to remove an item from the cart
    const removeFromCart = async (itemId) => {
        try {
            console.log("CartContext - Removing item from cart:", itemId);
            await axios.post(
                `${backendUrl}/api/cart/remove`,
                { itemId },
                { headers: getHeaders() }
            );
            console.log("CartContext - Item removed successfully.");
            await fetchCart(); // Update cart after removal
        } catch (error) {
            console.error("CartContext - Error removing from cart:", error);
        }
    };

    // Function to update the quantity of an item in the cart
    const updateCartQuantity = async (itemId, quantity) => {
        try {
            console.log(`CartContext - Updating item (${itemId}) quantity to:`, quantity);
            await axios.post(
                `${backendUrl}/api/cart/update`,
                { itemId, quantity },
                { headers: getHeaders() }
            );
            console.log("CartContext - Item quantity updated successfully.");
            await fetchCart(); // Update cart to reflect new quantity
        } catch (error) {
            console.error("CartContext - Error updating cart quantity:", error);
        }
    };

    // Fetches the cart on component mount or when user/visitor changes
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
                fetchCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};