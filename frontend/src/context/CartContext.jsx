import React, { createContext, useState, useEffect } from "react";
import { getVisitorCart, addToVisitorCart, removeFromVisitorCart, updateVisitorCartQuantity, clearVisitorCart } from "../utils/cartUtils";
import axios from "axios";

export const CartContext = createContext();

const CartContextProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const isLoggedIn = !!localStorage.getItem("token"); // Check if user is logged in

    // Sync cart from backend for logged-in users
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

    // Sync visitor cart from localStorage
    const fetchVisitorCart = () => {
        const cart = getVisitorCart();
        setCart(cart || []);
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalPrice(total);
    };

    // Refresh cart based on login status
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
            // Send request to backend
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

export default CartContextProvider;