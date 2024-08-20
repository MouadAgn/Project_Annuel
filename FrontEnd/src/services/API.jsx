class Api {
    constructor(baseUrl="https://127.0.0.1:8000/api") {
        this.baseUrl = baseUrl;
    }

    // Token Admin
    // token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MjM0Njk1MTEsImV4cCI6MTcyNTQ2OTUxMSwicm9sZXMiOlsiUk9MRV9BRE1JTiJdLCJ1c2VybmFtZSI6InVzZXIxQGV4YW1wbGUuY29tIn0.V_6Twh78ucNIvD8PM-6YEwDtQc2RIesXr3SwIlypqPUdapCO3DbCseNRLKZ9QEb17wH-oSyFanX8t5VvR3foaGLxDcSx6mDXYwJiHPxZKLbtlB0Ops0Kxwiep5_Ry2f3cHClEcKnqNt_nmDKSAC4hAHNntzdPAJAqxWIcBDBlMSwOELiRs97PJeYUSCjrZXhVoyonElnAmLjuHuRrZPEmsP0T65SNDPv2sKw-VP0DI6m5qotOdEzxT1ow5hohyViGVaW81hwp7rv1_NjBwoxmbrZKP4cKsLIl2-nXCzDGI0dPgVhfasZmTozy-uoxICIsfxGufAAtugICTvhA1R6-w"
    
    // Token User
    //  token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MjQxODU0NzUsImV4cCI6MTcyNjE4NTQ3NSwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoidXRlc3NjQGV4YW1wbGUuY29tIn0.1mbNyJfLK1L21rHM6vcwQiDXrNm3KWxdkySYzelGJ-Cv5rQ5x69loW3FJ9atJFOiKY16rsTI0XLH4N51U_we3qNe2qfB_2eEDwsmFFDbb_pvuVMYIMqdG7ILS4RSb9o-K5l0BY8NGwsL00whLdYQ4mK8soFHA5NVvug5kp31IcvJeeuvgiWUVg8J9VslyR2JFVjir5VG5PtaHE6YUyWSeC-J3BD07eQYj8PjQ_NbEhndxX_JIpBrtA-O7FgzGaPgR6OanP1lRIBubrFehzDTT-NOaR1CZ2VaMmPkNAeajbs-5l6LHVKYD9ENV33283oyFDCpbRVGj2RH2n3IzSxZ6A"

    async getCredentials(mail, password) {
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

    async Register(name, firstName, address, city, zipCode, country, mail, password) {
        try {
            const response = await fetch(`${this.baseUrl}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    firstName: firstName,
                    address: address,
                    city: city,
                    zipCode: zipCode,
                    country: country,
                    mail: mail,
                    password: password,
                }),
            });
            // console.log(response);
            if (response.status === 200) {
                const data = await response.json();
                return data.token;
            } else {
                const errorData = await response.json();
                // throw new Error(JSON.stringify(errorData.errors));
                console.log(errorData);
            }
        } catch(error) {
            throw error;
        }
    }

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

    async createPaymentIntent(token) {
        try {
            const response = await fetch(`${this.baseUrl}/create-payment-intent`, {
                method: "POST",
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
