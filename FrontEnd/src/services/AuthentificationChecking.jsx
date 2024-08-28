// Validate email format
export const validateEmail = (email) => {
    const result = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return result.test(email);
};

// Validate password format
export const validatePassword = (password) => {
    // Atleast one lowercase, one uppercase, one digit, one special character, minimum 8 characters
    const result = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return result.test(password);
};

// Clean the input by removing HTML tags and limiting the length
export const cleanInput = (input) => {
    return input.replace(/<[^>]*>/g, '').trim().slice(0, 255);
};

// Clean the email by removing extra spaces
export const cleanMail = (input) => {
    return input.trim().replace(/\s+/g, ' ');
};