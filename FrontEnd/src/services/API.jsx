class Api {
    constructor(baseUrl="https://127.0.0.1:8000/api") {
        this.baseUrl = baseUrl;
    }

    // Token Admin
    token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MjM0Njk1MTEsImV4cCI6MTcyNTQ2OTUxMSwicm9sZXMiOlsiUk9MRV9BRE1JTiJdLCJ1c2VybmFtZSI6InVzZXIxQGV4YW1wbGUuY29tIn0.V_6Twh78ucNIvD8PM-6YEwDtQc2RIesXr3SwIlypqPUdapCO3DbCseNRLKZ9QEb17wH-oSyFanX8t5VvR3foaGLxDcSx6mDXYwJiHPxZKLbtlB0Ops0Kxwiep5_Ry2f3cHClEcKnqNt_nmDKSAC4hAHNntzdPAJAqxWIcBDBlMSwOELiRs97PJeYUSCjrZXhVoyonElnAmLjuHuRrZPEmsP0T65SNDPv2sKw-VP0DI6m5qotOdEzxT1ow5hohyViGVaW81hwp7rv1_NjBwoxmbrZKP4cKsLIl2-nXCzDGI0dPgVhfasZmTozy-uoxICIsfxGufAAtugICTvhA1R6-w"
    
    // Token User
    // token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MjM0Njc2MTIsImV4cCI6MTcyNTQ2NzYxMiwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoieGtsaW5nQGJhc2hpcmlhbi5jb20ifQ.KLeFZNsghwFTqIZK9x2XzFLa2F9qNrqYk3RGZqkpJQLZPa_K6QupEnM-b2cLqMYNrGm4ETCmcqVTAdIOVEznhbhHVzqK8XXFt6P-hCgRixh7Nan6G1Rd6zNuRi0U-u3sMgQgwsb-cwsuTbrHD2btOqMLIZLAGfv2oPLvZkTrNjHNrfmGL_aFbSjOxaV4ft90uuegYx2NzFujWgPvGT0LRJ5SuwVArLWwMrmPBrL1YM4H3s0liG67T_YxP-sJ03Y2Svy9Pl37o_wKEsXTD5toVUr4L_8oTj9zHp44Sya7yXRbEcqUbsbjxnUjLG2eQVOrP7ekg94B9QssO9lGBHctbA"

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
            const response = await fetch(`${this.baseUrl}/user/update`, {
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
            const response = await fetch(`${this.baseUrl}/user/delete`, {
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
            const response = await fetch(`${this.baseUrl}/user/addStorage`, {
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
