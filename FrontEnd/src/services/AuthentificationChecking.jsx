// Validation du format de l'email
export const validateEmail = (email) => {
    const result = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return result.test(email);
};

// Validation de la force du mot de passe
export const validatePassword = (password) => {
    // Au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial
    const result = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return result.test(password);
};

// Prévention des attaques XSS
export const cleanInput = (input) => {
    return encodeURIComponent(input);
};

// Nettoyage des espaces inutiles pour les mail
export const cleanMail = (input) => {
    return input.trim().replace(/\s+/g, ' ');
};