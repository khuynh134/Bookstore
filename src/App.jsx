import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css'

// Import page components 
import Home from './pages/Home';
import About from './pages/About';
import Profile from './pages/Profile';
import SearchResult from './pages/SearchResult';
import SearchBar from './components/SearchBar';

function App() {
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
            <Link to="/profile" className="nav-link profile-link">
              <span className="material-symbols-outlined">account_circle</span>
              Profile
            </Link>
          </div>
        </nav>

        {/* Main Content Container */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/s/:query" element={<SearchResult/>} />
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
