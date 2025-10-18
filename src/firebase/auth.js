import { auth } from "./firebase";

import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword,signInWithPopup } from "firebase/auth";

export const doCreateUserWithEmailandPassword = async ( email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result; 
}; 

export const doSignOut = () => {
    return auth.signOut(); 
};

//export const doPasswordReset = (email) => {
//    return sendPasswordResetEmail(auth, email);
//};

//export const doPasswaordChange = (password) => {
//    return updatePassword(auth.currentUser, password);
//};

//export const doSendEmailVerification = () => {
//    return sendEmailVerification(auth.currentUser, {
//        url: `${window.location.origin}/home`
//    });
//};