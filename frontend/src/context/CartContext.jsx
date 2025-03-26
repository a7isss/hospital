import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { AppContext } from "./AppContext";

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
    const { token, backendUrl } = useContext(AppContext); // Removed visitorID from AppContext
    const [visitorID, setVisitorID] = useState(() => {
        // Initialize visitorID from local storage or create a new one
        const storedVisitorID = localStorage.getItem("visitorID");
        if (storedVisitorID) {
            return storedVisitorID;
        } else {
            const newVisitorID = uuidv4(); // Generate unique visitor ID
            localStorage.setItem("visitorID", newVisitorID); // Persist in local storage
            return newVisitorID;
        }
    });
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [totalPrice, setTotalPrice] = useState(() => {
        const savedPrice = localStorage.getItem("totalPrice");
        return savedPrice ? parseFloat(savedPrice) : 0;
    });
    const [error, setError] = useState(null);

    const isLoggedIn = !!token;

    // Generate headers dynamically for API requests
    const getHeaders = () => {
        return {
            Authorization: isLoggedIn
                ? `Bearer ${token}`
                : `Bearer ${visitorID}`,
        };
    };

    // Save cart data to local storage
    const saveCartToLocalStorage = (cart, totalPrice) => {
        localStorage.setItem("cart", JSON.stringify(cart));
        localStorage.setItem("totalPrice", totalPrice.toString());
    };

    // Fetch the cart from the backend
    const fetchCart = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/cart`, { headers: getHeaders() });
            const fetchedCart = data.cart.items || [];
            const fetchedTotalPrice = data.cart.totalPrice || 0;

            setCart(fetchedCart);
            setTotalPrice(fetchedTotalPrice);
            saveCartToLocalStorage(fetchedCart, fetchedTotalPrice);
        } catch (error) {
            console.error("CartContext - Error fetching cart:", error);
            setCart([]);
            setTotalPrice(0);
        }
    };

    // Add an item to the cart
    const addToCart = async (item) => {
        try {
            await axios.post(
                `${backendUrl}/api/cart/add`,
                { itemId: item.itemId },
                { headers: getHeaders() }
            );
            await fetchCart();
        } catch (error) {
            console.error("CartContext - Error adding to cart:", error);
        }
    };

    // Remove an item from the cart
    const removeFromCart = async (itemId) => {
        try {
            await axios.post(
                `${backendUrl}/api/cart/remove`,
                { itemId },
                { headers: getHeaders() }
            );
            await fetchCart();
        } catch (error) {
            console.error("CartContext - Error removing from cart:", error);
        }
    };

    // Update the quantity of an item in the cart
    const updateCartQuantity = async (itemId, quantity) => {
        try {
            await axios.post(
                `${backendUrl}/api/cart/update`,
                { itemId, quantity },
                { headers: getHeaders() }
            );
            await fetchCart();
        } catch (error) {
            console.error("CartContext - Error updating cart quantity:", error);
        }
    };

    // Clear the cart
    const clearCart = async () => {
        try {
            await axios.post(`${backendUrl}/api/cart/clear`, {}, { headers: getHeaders() });
            setCart([]);
            setTotalPrice(0);
            saveCartToLocalStorage([], 0);
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