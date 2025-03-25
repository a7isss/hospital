// src/utils/cartUtils.js

// Retrieve the visitor's cart from localStorage
export const getVisitorCart = () => {
    const cart = localStorage.getItem("visitorCart");
    return cart ? JSON.parse(cart) : []; // Return an empty array if no cart is found
};

// Add an item to the visitor's cart
export const addToVisitorCart = (item) => {
    const cart = getVisitorCart(); // Get current cart
    const existingItemIndex = cart.findIndex((cartItem) => cartItem.itemId === item.itemId);

    if (existingItemIndex !== -1) {
        // Update quantity if item already exists in the cart
        cart[existingItemIndex].quantity += item.quantity;
    } else {
        // Add the new item to the cart
        cart.push(item);
    }

    localStorage.setItem("visitorCart", JSON.stringify(cart)); // Save updated cart to localStorage
    return cart;
};

// Remove an item from the visitor's cart
export const removeFromVisitorCart = (itemId) => {
    const cart = getVisitorCart(); // Get current cart
    const updatedCart = cart.filter((cartItem) => cartItem.itemId !== itemId); // Remove item

    localStorage.setItem("visitorCart", JSON.stringify(updatedCart)); // Save updated cart to localStorage
    return updatedCart;
};

// Update the quantity of an item in the visitor's cart
export const updateVisitorCartQuantity = (itemId, quantity) => {
    const cart = getVisitorCart(); // Get current cart
    const updatedCart = cart.map((cartItem) =>
        cartItem.itemId === itemId ? { ...cartItem, quantity } : cartItem
    ); // Update quantity of the matching item

    localStorage.setItem("visitorCart", JSON.stringify(updatedCart)); // Save updated cart to localStorage
    return updatedCart;
};

// Clear the visitor's cart
export const clearVisitorCart = () => {
    localStorage.removeItem("visitorCart"); // Remove cart from localStorage
};