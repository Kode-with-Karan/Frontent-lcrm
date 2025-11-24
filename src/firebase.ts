import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
apiKey: "AIzaSyDdIsVYmqpN3JRyH0uCqlGNbKlX-QMSVrM",
  authDomain: "klype-68b5e.firebaseapp.com",
  projectId: "klype-68b5e",
  storageBucket: "klype-68b5e.appspot.com",
  messagingSenderId: "408859818210",
  appId: "1:408859818210:web:7a93107410eecbe37546bb",
  measurementId: "G-1Z42JZTMGW",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };