import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Configurações do Firebase
// Substitua com suas próprias configurações do Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCDR1KKQ3STNn2elYv8atcmWTEYFP6yCaQ",
  authDomain: "restaurant-microservices.firebaseapp.com",
  projectId: "restaurant-microservices",
  storageBucket: "restaurant-microservices.firebasestorage.app",
  messagingSenderId: "46083077454",
  appId: "1:46083077454:web:3550d0764c85d2f5dc1a1f"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth
export const auth = getAuth(app);

export default app;
