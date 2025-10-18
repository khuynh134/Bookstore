import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css'


import Home from './pages/Home';
import About from './pages/About';
import Profile from './pages/Profile';
import SearchResult from './pages/SearchResult';
import SearchBar from './components/SearchBar';
import Cart from './pages/Cart';
import AuthorPage from './pages/AuthorPage';
import LoginPage from './components/auth/login/LoginPage'; 
import { useAuth } from './components/context/authContext/authContext';

function App() {
  const { userLoggedIn } = useAuth();
  const navRef = useRef(null); 
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
            {userLoggedIn ? (
              <Link to="/profile" className="nav-link profile-link">
                <span className="material-symbols-outlined">account_circle</span>
                Profile
              </Link>
            ) : (
              <Link to="/login" className="nav-link">
                <span className="material-symbols-outlined">login</span>
                Login
              </Link>
            )}
          </div>
        </nav>

        {/* Main Content Container */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/s/:keyword" element={<SearchResult/>} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/author/:authorID" element={<AuthorPage/>} />
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
