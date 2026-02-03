
// Helper function to parse Clerk errors into user-friendly messages
export const parseClerkError = (err: any): string => {
    if (!err) return "An unexpected error occurred";

    // Handle Clerk error format
    if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
        const firstError = err.errors[0];
        const message = firstError.message || firstError.longMessage;

        // Map common error codes to user-friendly messages
        if (firstError.code === "form_identifier_exists") {
            return "This email is already registered. Please sign in instead.";
        }
        if (firstError.code === "form_password_pwned") {
            return "This password has been found in a data breach. Please choose a different password.";
        }
        if (firstError.code === "form_password_length_too_short") {
            return "Password must be at least 8 characters long.";
        }
        if (firstError.code === "form_param_format_invalid") {
            return message || "Invalid input format. Please check your information.";
        }
        if (firstError.code === "form_identifier_not_found") {
            return "Email address not found.";
        }
        if (firstError.code === "form_code_incorrect") {
            return "Incorrect verification code. Please try again.";
        }

        return message || "Please check your information and try again.";
    }

    // Handle network errors
    if (err.message && err.message.includes("network")) {
        return "Network error. Please check your connection and try again.";
    }

    // Fallback to error message or generic message
    return err.message || "An error occurred. Please try again.";
};
