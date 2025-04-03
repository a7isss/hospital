import React, { createContext, useState, useEffect, useContext } from "react";
import useAuthStore from "../store/authStore"; // Import Zustand's authStore

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
    const visitorId = useAuthStore((state) => state.visitorId); // Visitor Id from authStore
    const userData = useAuthStore((state) => state.userData); // Logged-in user data from authStore
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated); // Authentication state from authStore

    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    // Helper to get storage key based on user status
    const getCartKey = () => {
        return isAuthenticated && userData?.id
            ? `cart_user_${userData.id}` // Use logged-in user ID for cart key
            : `cart_visitor_${visitorId}`; // Use visitor ID for cart key
    };

    // Helper to calculate total price
    const recalculateTotalPrice = (cartItems) => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    // Load the cart from local storage on initialization
    useEffect(() => {
        const cartKey = getCartKey(); // Get key based on current user/visitor
        try {
            const savedCart = localStorage.getItem(cartKey);
            const savedPrice = localStorage.getItem(`${cartKey}_totalPrice`);

            setCart(savedCart ? JSON.parse(savedCart) : []); // Set cart data
            setTotalPrice(savedPrice ? parseFloat(savedPrice) : 0); // Set total price
        } catch (error) {
            console.error("Error loading cart:", error);
        }
    }, [visitorId, userData, isAuthenticated]); // Reload cart when user or visitor context changes

    // Save the cart data to local storage when cart changes
    useEffect(() => {
        const cartKey = getCartKey(); // Get key based on current user/visitor
        try {
            localStorage.setItem(cartKey, JSON.stringify(cart)); // Save cart data
            localStorage.setItem(`${cartKey}_totalPrice`, totalPrice.toString()); // Save total price
        } catch (error) {
            console.error("Error saving cart:", error);
        }
    }, [cart, totalPrice, visitorId, userData, isAuthenticated]);

    // Function to handle adding an item to the cart
    const addToCart = (item) => {
        if (!item?.price || !item?.itemId) return; // Validate required item fields

        setCart((prevCart) => {
            const existingItem = prevCart.find((i) => i.itemId === item.itemId);
            const updatedCart = existingItem
                ? prevCart.map((i) =>
                    i.itemId === item.itemId ? { ...i, quantity: i.quantity + 1 } : i
                )
                : [...prevCart, { ...item, quantity: 1 }]; // Add new item if it doesn't exist

            const newTotalPrice = recalculateTotalPrice(updatedCart); // Recalculate total
            setTotalPrice(newTotalPrice); // Update state
            return updatedCart; // Return updated cart
        });
    };

    // Function to update the quantity of an item in the cart
    const updateCartQuantity = (itemId, newQuantity) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.map((item) =>
                item.itemId === itemId ? { ...item, quantity: newQuantity } : item
            );
            setTotalPrice(recalculateTotalPrice(updatedCart));
            return updatedCart;
        });
    };

    // Function to remove an item from the cart
    const removeFromCart = (itemId) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.filter((item) => item.itemId !== itemId);
            setTotalPrice(recalculateTotalPrice(updatedCart));
            return updatedCart;
        });
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                totalPrice,
                addToCart,
                updateCartQuantity,
                removeFromCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};