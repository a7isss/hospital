import authService from "../services/authService";

const FormSubmit = async (formData, isRegistering) => {
    try {
        let response;
        if (isRegistering) {
            // Use the authService to register the user with password
            response = await authService.registerUser({
                name: formData.name,
                phone: formData.phone,
                age: formData.age,
                password: formData.password, // Add the password field
            });
        } else {
            // Use the authService to log in the user with phone instead of email
            response = await authService.loginUser({
                phone: formData.phone, // Use phone for login
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