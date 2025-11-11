import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css'


import Home from './pages/Home';
import About from './pages/About';
import Profile from './pages/Profile';
import SearchResult from './pages/SearchResult';
import SearchBar from './components/SearchBar';
import Cart from './pages/Cart';
import AuthorPage from './pages/AuthorPage';
import Register from './pages/Register';
import Login from './pages/Login';
import BooksOfCategory from './pages/Category';
import { AuthProvider, useAuth } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}

function InnerApp() {
  const { isAuthenticated, logout } = useAuth();
  const navRef = useRef(null);
  const handleSignOut = async () => {
    await logout();
    window.location.href = '/login';
  };
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const factor = 0.25; //  controls how much the navbar lags behind scroll
    let ticking = false;

    const onScroll = () => {
      const offset = window.scrollY * factor;
      if (!ticking) {
        requestAnimationFrame(() => {
          nav.style.transform = `translateY(${offset}px)`; //  move the navbar
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="nav-brand">
            <h2>Bookstore </h2>
          </div>
          <div className="nav-links">
            <div className='nav-link'>
              <SearchBar></SearchBar>
            </div>
            <Link to="/" className="nav-link home-icon-link">
              <span className="material-symbols-outlined">home_app_logo</span>
              Home
            </Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/cart" className="nav-link">
              <span className="material-symbols-outlined">shopping_cart</span>
              Cart
            </Link>
           
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="nav-link">Profile</Link>
                <button className="nav-link" onClick={handleSignOut} style={{background:'transparent',border:'none',cursor:'pointer'}}>Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Sign In</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </>
            )}
          </div>
        </nav>

        {/* Main Content Container */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />} />
            <Route path="/s/:keyword" element={<SearchResult/>} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/register" element={<Register />} />
            <Route path="/author/:authorID" element={<AuthorPage/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/category/:category" element = {<BooksOfCategory/>} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          © 2025 All Rights Reserved 
        </footer>
      </div>
    </BrowserRouter>
    
  )
}
export default App
