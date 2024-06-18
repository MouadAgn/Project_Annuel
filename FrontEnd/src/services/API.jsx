class Api {
    constructor(baseUrl="https://127.0.0.1:8000/api") {
        this.baseUrl = baseUrl;
    }

    async getToken(mail, password) {
        try  {
            const response = await fetch(`${this.baseUrl}/login_check`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mail: mail,
                    password: password,
                }),
            });

            if (response.status === 200) {
                const data = await response.json();
                return data.token;
            } else {
                throw new Error("Invalid credentials");
            }
        } catch (error) {
            throw error;
        }
    }

    async getAllUsers(token) {
        try {
            const response = await fetch(`${this.baseUrl}/admin/users`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                const data = await response.json();
                return data;
            } else {
                throw new Error("Invalid token");
            }
        } catch (error) {
            throw error;
        }
    }
}

export default Api;
