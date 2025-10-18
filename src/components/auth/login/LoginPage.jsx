import React, { useState } from 'react'; 
import { Navigate, Link } from 'react-router-dom';
import { doSignInWithEmailAndPassword, doSignInWithGoogle  } from '../../../firebase/auth';
import { useAuth } from '../../context/authContext/authContext';
import './LoginPage.css';

const LoginPage = () => {
    const { userLoggedIn} = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault()
        if(!isSigningIn) {
            setIsSigningIn(true);
            await doSignInWithEmailAndPassword(email, password)
        }
    }

    const onGoogleSignIn = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            doSignInWithGoogle().catch(err => {
                setIsSigningIn(false)

            })}
        }

    return (
        <div className="login-page">
            {userLoggedIn && <Navigate to="/profile" replace={true} />}

            <h2>Login</h2>
            <form onSubmit={onSubmit} className="login-form">
                <div> 
                    <label className="login-page-label">
                        Email
                    </label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label className="login-page-label">
                        Password
                    </label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" disabled={isSigningIn}>
                    {isSigningIn ? 'Signing in...' : 'Sign In'}
                </button>
                <button type="button" onClick={onGoogleSignIn} disabled={isSigningIn}>
                    Sign in with Google
                </button>
                <div>
                    <Link to="/signup">Don't have an account? Sign up</Link>
                </div>
            </form>

        </div>
    )
    }

   export default LoginPage;