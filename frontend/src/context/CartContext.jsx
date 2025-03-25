// src/context/CartContext.jsx

import React, { createContext, useState, useEffect } from "react";
import {
    getVisitorCart,
    addToVisitorCart,
    removeFromVisitorCart,
    updateVisitorCartQuantity,
    clearVisitorCart,
} from "../utils/cartUtils";
import axios from "axios";

// Create CartContext
export const CartContext = createContext(); // Ensure this is exported

const CartContextProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const isLoggedIn = !!localStorage.getItem("token"); // Check if user is logged in

    // Fetch user cart
    const fetchUserCart = async () => {
        try {
            const { data } = await axios.get("/api/cart", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setCart(data.cart.items);
            setTotalPrice(data.cart.totalPrice);
        } catch (error) {
            console.error("Failed to fetch user cart:", error);
        }
    };

    // Fetch visitor cart
    const fetchVisitorCart = () => {
        const cart = getVisitorCart();
        setCart(cart || []);
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalPrice(total);
    };

    // Refresh Cart
    const refreshCart = () => {
        if (isLoggedIn) {
            fetchUserCart();
        } else {
            fetchVisitorCart();
        }
    };

    // Add item to cart
    const addToCart = async (item) => {
        if (isLoggedIn) {
            await axios.post("/api/cart/add", item, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchUserCart();
        } else {
            const updatedCart = addToVisitorCart(item);
            setCart(updatedCart);
            setTotalPrice(updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0));
        }
    };

    // Remove item from cart
    const removeFromCart = async (itemId) => {
        if (isLoggedIn) {
            await axios.post("/api/cart/remove", { itemId }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchUserCart();
        } else {
            const updatedCart = removeFromVisitorCart(itemId);
            setCart(updatedCart);
            setTotalPrice(updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0));
        }
    };

    // Update item quantity
    const updateCartQuantity = async (itemId, quantity) => {
        if (isLoggedIn) {
            await axios.post("/api/cart/update", { itemId, quantity }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchUserCart();
        } else {
            const updatedCart = updateVisitorCartQuantity(itemId, quantity);
            setCart(updatedCart);
            setTotalPrice(updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0));
        }
    };

    // Clear cart
    const clearCart = async () => {
        if (isLoggedIn) {
            await axios.post("/api/cart/clear", null, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchUserCart();
        } else {
            clearVisitorCart();
            setCart([]);
            setTotalPrice(0);
        }
    };

    // Refresh cart on mount
    useEffect(() => {
        refreshCart();
    }, [isLoggedIn]);

    // Provide context values
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

// Export both CartContext and its Provider
export { CartContextProvider };
export default CartContextProvider; // Add this line at the end
