import axios from 'axios';

const FormSubmit = async (formData, isRegistering) => {
    try {
        let response;
        if (isRegistering) {
            // Send registration data to the backend
            response = await axios.post('/api/register', formData);
        } else {
            // Send login data to the backend
            response = await axios.post('/api/login', {
                email: formData.email, // Assuming email is part of the login form
                password: formData.password,
            });
        }
        return response.data; // Return the response data
    } catch (error) {
        console.error("Error during submission:", error);
        throw error; // Rethrow the error for handling in the calling component
    }
};

export default FormSubmit;
