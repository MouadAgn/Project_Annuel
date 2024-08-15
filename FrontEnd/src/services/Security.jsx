import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// Function qui récupére le token dans le localStorage & le décode pour récupérer le role & le mail de l'user
export default function jwtDecodeToken() {
    const token = localStorage.getItem('token');
    if (token) {
        // console.log(token)
        return jwtDecode(token);
    }
    return null;
};
