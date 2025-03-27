import React from 'react';
import Waimg from '../assets/wa.png'; // Adjust the path if necessary

const WhatsAppChat = () => {
    const handleClick = () => {
        // Replace with your WhatsApp link
        window.open('http://wa.me/966920025092', '_blank'); // Replace with your WhatsApp number
    };

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '20px',
                left: '20px',
                cursor: 'pointer',
                zIndex: 1000,
            }}
            onClick={handleClick}
        >
            <img
                src= {Waimg}
                alt="WhatsApp"
                style={{
                    width: '60px', // Adjust size as needed
                    height: '60px',
                }}
            />
        </div>
    );
};

export default WhatsAppChat;
