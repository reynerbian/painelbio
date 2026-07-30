// Configurações do seu projeto Firebase.
// Substitua as chaves abaixo com as credenciais do seu projeto obtidas no Firebase Console.
const firebaseConfig = {
    apiKey: "AIzaSyC4iYfRTrdK6omvPjziTw1zbH3VkidLSFc",
    authDomain: "painelbio-39e1f.firebaseapp.com",
    projectId: "painelbio-39e1f",
    storageBucket: "painelbio-39e1f.firebasestorage.app",
    messagingSenderId: "735076897440",
    appId: "1:735076897440:web:2f5dd2d99ea539b9776fc5"
};

// Verifica se as chaves foram preenchidas para inicializar o Firebase
let firebaseApp = null;
let firestoreDb = null;

if (firebaseConfig.projectId && firebaseConfig.apiKey) {
    try {
        // Inicializa o Firebase
        firebaseApp = firebase.initializeApp(firebaseConfig);
        firestoreDb = firebase.firestore(firebaseApp);
        
        // Habilita persistência offline do Firestore para carregar dados mesmo sem internet
        firestoreDb.enablePersistence().catch((err) => {
            if (err.code == 'failed-precondition') {
                console.warn('Persistência falhou: Múltiplas abas abertas.');
            } else if (err.code == 'unimplemented') {
                console.warn('Navegador não suporta persistência offline.');
            }
        });
        console.log("Firebase Firestore inicializado com sucesso!");
    } catch (e) {
        console.error("Erro ao inicializar Firebase:", e);
    }
} else {
    console.warn("Credenciais do Firebase vazias. O PainelBio rodará usando o banco de dados Local (LocalStorage) como fallback.");
}

// Expõe globalmente
window.firestoreDb = firestoreDb;
window.firebaseConfigured = !!(firebaseApp && firestoreDb);
