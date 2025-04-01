import authService from '../services/authService'; // Adjust the path as necessary

const FormSubmit = async (formData, isRegistering) => {
    try {
        let response;
        if (isRegistering) {
            // Use the authService to register the user
            response = await authService.registerUser({
                name: formData.name,
                phone: formData.phone,
                age: formData.age,
            });
        } else {
            // Use the authService to log in the user
            response = await authService.loginUser({
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