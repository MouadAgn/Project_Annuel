class Api {
    constructor(baseUrl="https://127.0.0.1:8000/api") {
        this.baseUrl = baseUrl;
    }

    // Token Admin
    token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MTg5NDcxOTcsImV4cCI6MTcyMDk0NzE5Nywicm9sZXMiOlsiUk9MRV9BRE1JTiJdLCJ1c2VybmFtZSI6InVzZXIxQGV4YW1wbGUuY29tIn0.K_JjsPGeq2gvPIL572jDuNjLQaOPpExO6u0IOucrp7TqzVON2N43KAQfG8gxr_YUZGue9N6fFbj8m5R2Aa7e5hDFPQsaeTNZIwiJTlKUGV2IFlGiKPIksb_YnFCgirb2VGzENlsZVWPMD4wvRQo-gpY0aU4fMJKKsTt4kEPFgFr6AqQDLZpBMI7iLEtGHrNU90gsPGx4OPu0qK7Ax_u2s72_eBqpS9-R-LhRr_-urw9AWagS274RRKK-vFWvw3TfmjIlBda-2QGd_5cnUlJ_D6zq6vndsMfHkQXXIb416DNz1zc6Hwz3uDVoPtXtY2-LiYQUKvvAVsVPzdmj82ZdZA"
    
    // Token User
    // token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MTg5NDcyMTksImV4cCI6MTcyMDk0NzIxOSwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoidXNlckBleGFtcGxlLmNvbSJ9.iPzOJ1-9Oj8blHLCLPCPIJyVY-mJIE8pWXAUy80j3xeJ-5a3W6Wq6s2JFC6HJzPS6It0jhSqpaYnXpuIKfqJgsVa4O1Xc7CJAnYhZBTCdislxiiHMJnozohqk99teMS9hRwzS22zIq5cY7naEpHh250BoCWRZhmzmDzLX9BO7FVHK6i0MCS5nRjUi1PvA2jO0YmKOoDv19peH16YutSkaWtu9OMmQ2-onps6ujJqM1n9-ILmgydK_--dzpltuKsS9TDsxtVQU3i1ici_5PABKHBvAbguoSXjhJco_pOpO7gi-gaUbOPWtQrUgQ8zLlPghB0OkN9_VIn-RsXJGzMLcA"

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

    /* START ADMIN ROUTES */
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

    async getUserById(token) {
        try {
            const response = await fetch(`${this.baseUrl}/admin/${id}`, {
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

    /* END ADMIN ROUTES */

    /* START USER ROUTES */

    async getUserProfile(token) {
        try {
            const response = await fetch(`${this.baseUrl}/user/profile`, {
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

    async updateUserProfile(token, data) {
        try {
            const response = await fetch(`${this.baseUrl}/update`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            if (response.status === 200) {
                const data = await response.json();
                return data;
            } else {
                throw new Error("Invalid token");
            }
        }
        catch (error) {
            throw error;
        }
    }

    async deleteUserProfile(token) {
        try {
            const response = await fetch(`${this.baseUrl}/delete`, {
                method: "DELETE",
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
        }
        catch (error) {
            throw error;
        }
    }

    async addStorage(token) {
        try {
            const response = await fetch(`${this.baseUrl}/addStorage`, {
                method: "PUT",
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
        }
        catch (error) {
            throw error;
        }
    }

    /* END USER ROUTES */

    

    /* START FILES ROUTES */


    /* END FILES ROUTES */



    /* START INVOICES ROUTES */


    /* END INVOICES ROUTES */
}

export default Api;
