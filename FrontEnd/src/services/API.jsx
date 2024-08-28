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
                return data;
            } else if (response.status === 401) {
                return false;
            } else {
                throw new Error("An error occured");
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
    async getAllFiles(token) {
        try {
            const response = await fetch(`${this.baseUrl}/admin/files`, {
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
                throw new Error("Invalid token or error fetching invoices");
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
            if (response.status === 201) {
                const data = await response.json();
                return data;
            } else {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData.errors));
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
            // console.log('token', token);
            const response = await fetch(`${this.baseUrl}/user/update`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            // console.log('response', response);
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                const errorData = await response.json();
                if (errorData.errors) {
                    // Si l'erreur est un tableau d'erreurs
                    throw new Error(Object.values(errorData.errors).join(', '));
                } else {
                    // Si l'erreur est un message unique
                    throw new Error(errorData.message || "Une erreur est survenue");
                }
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
            console.log('response', response);
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

    async addFile(token, formData) {
        try {
            const response = await fetch(`${this.baseUrl}/user/add-file`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData  // Ne pas définir Content-Type ici
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de l\'upload du fichier');
            }
    
            return await response.json();
        } catch (error) {
            console.error('Error in addFile:', error);
            throw error;
        }
    }

    async createFolder(folderName) {
        try {
            const response = await fetch(`${this.baseUrl}/folders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: folderName }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la création du dossier');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    async listFiles() {
        try {
            const response = await fetch(`${this.baseUrl}/list-files`);
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération de la liste des fichiers');
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    async listFolders() {
        try {
            const response = await fetch(`${this.baseUrl}/folders`);
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération de la liste des dossiers');
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    async getFolders() {
        const response = await fetch(`${this.baseUrl}/folders`);
        if (!response.ok) {
            throw new Error('An error occurred while loading folders');
        }
        return response.json();
    }
    
    async getFolderFiles(folderId) {
        const response = await fetch(`${this.baseUrl}/folders/${folderId}/files`);
        if (!response.ok) {
            throw new Error('Error fetching files');
        }
        return response.json();
    }

    async deleteFileFromFolder(folderId, fileId) {
        const response = await fetch(`${this.baseUrl}/folders/${folderId}/files`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileId }),
        });
        if (!response.ok) {
            throw new Error('Error deleting file');
        }
        return response.json();
    }

    async deleteFolder(folderId) {
        const response = await fetch(`${this.baseUrl}/folders/${folderId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Error deleting folder');
        }
        return response.json();
    }

    async addFileToFolder(folderId, fileId) {
        const response = await fetch(`${this.baseUrl}/folders/${folderId}/files`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileId }),
        });
        if (!response.ok) {
            throw new Error('Error adding file to folder');
        }
        return response.json();
    }

    async deleteFile(filename) {
        const response = await fetch(`${this.baseUrl}/delete-file/${filename}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Error deleting the file');
        }
        return await response.json();
    }

    async getFiles() {
        const response = await fetch(`${this.baseUrl}/list-files`);
        if (!response.ok) {
            throw new Error('Error fetching files');
        }
        return await response.json();
    }




    /* END FILES ROUTES */



    /* START INVOICES ROUTES */

    async getInvoices(token) {
        try {
            const response = await fetch(`${this.baseUrl}/user/invoices`, {
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
                throw new Error("Invalid token or error fetching invoices");
            }
        } catch (error) {
            throw error;
        }
    }

    async AddInvoice(token) {
        try {
            const response = await fetch(`${this.baseUrl}/invoice/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.status === 201) {
                const data = await response.json();
                return data;
            } else {
                throw new Error("Invalid token or error fetching invoices");
            }
        } catch (error) {
            throw error;
        }
    }
}
    /* END INVOICES ROUTES */


    /* END INVOICES ROUTES */


export default Api;
