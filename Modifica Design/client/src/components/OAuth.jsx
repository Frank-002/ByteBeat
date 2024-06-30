import React from 'react';
import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { useUser } from './UserContext.jsx'; // Assicurati di importare correttamente il provider di contesto UserProvider
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';
import "../css/OAuth.css";

const OAuth = () => {
    const auth = getAuth(app);
    const { signInSuccess } = useUser(); // Utilizzo del contesto UserProvider
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });

        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider);
            const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                signInSuccess(data); // Chiamata al metodo di contesto per gestire il successo del login
                navigate("/"); // Reindirizzamento dopo il login
            }

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="d-flex justify-content-center mt-3">
            <Button type="button" gradientDuoTone="pinkToOrange" onClick={handleGoogleClick}
                    className="button-no-hover-effect">
                <AiFillGoogleCircle className="w-6 h-6 mr-2"/>
                Continua con Google
            </Button>
        </div>
    );
};

export default OAuth;

