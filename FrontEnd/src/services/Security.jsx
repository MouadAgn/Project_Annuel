import { jwtDecode } from 'jwt-decode';

export default function Security() {

    const storedToken = window.localStorage.getItem('token');
    const decodedToken = jwtDecode(storedToken);

    const hasUserRole = decodedToken.roles.includes('ROLE_USER');
    const hasAdminRole = decodedToken.roles.includes('ROLE_ADMIN');
    
    return { hasUserRole, hasAdminRole};
}
