import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Funzione per salvare l'utente nei cookies
    const saveUserToCookies = (user) => {
        Cookies.set('currentUser', JSON.stringify(user), { expires: 7 }); // Set expiration to 7 days
    };

    // Funzione per rimuovere l'utente dai cookies
    const removeUserFromCookies = () => {
        Cookies.remove('currentUser');
    };

    // Funzione per caricare l'utente dai cookies quando il componente si monta
    const loadUserFromCookies = () => {
        const user = Cookies.get('currentUser');
        if (user) {
            const parsedUser = JSON.parse(user);
            setCurrentUser(parsedUser);
            setIsAdmin(parsedUser.isAdmin);
        }
        setLoading(false);
    };

    // Caricare l'utente dai cookies al montaggio del componente
    useEffect(() => {
        loadUserFromCookies();
    }, []);

    const signInStart = () => {
        setLoading(true);
        setError(null);
    };

    const signInSuccess = (user) => {
        setCurrentUser(user);
        setIsAdmin(user.isAdmin);
        saveUserToCookies(user);
        setLoading(false);
        setError(null);
    };

    const signInFailure = (error) => {
        setLoading(false);
        setError(error);
    };

    const updateStart = () => {
        setLoading(true);
        setError(null);
    };

    const updateSuccess = (user) => {
        setCurrentUser(user);
        setIsAdmin(user.isAdmin);
        saveUserToCookies(user);
        setLoading(false);
    };

    const updateFailure = (error) => {
        setLoading(false);
        setError(error);
    };

    const deleteStart = () => {
        setLoading(true);
        setError(null);
    };

    const deleteSuccess = () => {
        setCurrentUser(null);
        setIsAdmin(false);
        removeUserFromCookies();
        setLoading(false);
    };

    const deleteFailure = (error) => {
        setLoading(false);
        setError(error);
    };

    const signOutSuccess = () => {
        setCurrentUser(null);
        setIsAdmin(false);
        removeUserFromCookies();
        setLoading(false);
        setError(null);
    };

    return (
        <UserContext.Provider
            value={{
                currentUser,
                isAdmin,
                error,
                loading,
                signInStart,
                signInSuccess,
                signInFailure,
                updateStart,
                updateSuccess,
                updateFailure,
                deleteStart,
                deleteSuccess,
                deleteFailure,
                signOutSuccess,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};




