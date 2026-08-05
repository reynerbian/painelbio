// Gerenciador Unificado de Banco de Dados - PainelBio
// Abstrai a persistência entre o Firebase Firestore (Nuvem) e o LocalStorage (Local)

(function() {
    const LOCAL_KEY = 'painelbio-insta-leads';

    // Helper para obter leads locais
    function getLocalLeads() {
        try {
            return JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];
        } catch (e) {
            console.error("Erro ao ler LocalStorage:", e);
            return [];
        }
    }

    // Helper para salvar leads locais
    function saveLocalLeads(leads) {
        try {
            localStorage.setItem(LOCAL_KEY, JSON.stringify(leads));
        } catch (e) {
            console.error("Erro ao salvar LocalStorage:", e);
        }
    }

    const dbManager = {
        // Escuta as alterações na lista de sites em tempo real (OnSnapshot / Callback)
        subscribeLeads: function(callback) {
            if (window.firebaseConfigured && window.firestoreDb) {
                console.log("[DB] Escutando Firestore em tempo real...");
                // Escuta coleção "leads" ordenada pela data de criação decrescente
                return window.firestoreDb.collection("leads")
                    .orderBy("createdAt", "desc")
                    .onSnapshot((querySnapshot) => {
                        const leads = [];
                        querySnapshot.forEach((doc) => {
                            leads.push(doc.data());
                        });
                        // Espelha localmente para redundância/cache rápido
                        saveLocalLeads(leads);
                        callback(leads);
                    }, (error) => {
                        console.error("[DB] Erro no listener do Firestore:", error);
                        // Fallback em caso de falha de conexão temporária
                        callback(getLocalLeads());
                    });
            } else {
                console.log("[DB] Firebase inativo. Usando armazenamento local.");
                // Simula comportamento síncrono para o LocalStorage
                callback(getLocalLeads());
                
                // Retorna uma função de desinscrição "vazia" simulada
                return () => {};
            }
        },

        // Salva ou atualiza um site completo
        saveLead: async function(siteData) {
            if (!siteData || !siteData.arroba) {
                throw new Error("Site sem arroba identificado.");
            }

            const cleanArroba = siteData.arroba.trim().toLowerCase();
            siteData.arroba = cleanArroba;

            if (window.firebaseConfigured && window.firestoreDb) {
                console.log(`[DB] Gravando no Firestore: ${cleanArroba}`);
                try {
                    // Grava usando o arroba do cliente como ID exclusivo do documento
                    await window.firestoreDb.collection("leads").doc(cleanArroba).set(siteData, { merge: true });
                } catch (e) {
                    console.error("[DB] Falha ao gravar no Firestore, salvando localmente:", e);
                    this.saveLeadLocalFallback(siteData);
                }
            } else {
                this.saveLeadLocalFallback(siteData);
            }
        },

        // Gravação de fallback local
        saveLeadLocalFallback: function(siteData) {
            let leads = getLocalLeads();
            // Remove duplicado se houver
            leads = leads.filter(l => l.arroba.toLowerCase() !== siteData.arroba.toLowerCase());
            // Insere no início
            leads.unshift(siteData);
            saveLocalLeads(leads);
        },

        // Deleta um site
        deleteLead: async function(arroba) {
            const cleanArroba = arroba.trim().toLowerCase();

            if (window.firebaseConfigured && window.firestoreDb) {
                console.log(`[DB] Deletando do Firestore: ${cleanArroba}`);
                try {
                    await window.firestoreDb.collection("leads").doc(cleanArroba).delete();
                } catch (e) {
                    console.error("[DB] Falha ao deletar no Firestore, aplicando localmente:", e);
                    this.deleteLeadLocalFallback(cleanArroba);
                }
            } else {
                this.deleteLeadLocalFallback(cleanArroba);
            }
        },

        // Deleção de fallback local
        deleteLeadLocalFallback: function(arroba) {
            let leads = getLocalLeads();
            leads = leads.filter(l => l.arroba.toLowerCase() !== arroba.toLowerCase());
            saveLocalLeads(leads);
        }
    };

    window.db = dbManager;
})();
