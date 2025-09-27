import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css'

// Import page components 
import Home from './pages/Home';
import About from './pages/About';

function App() {
  return (
    <BrowserRouter>
    {/* Navigation Links */}
    <nav>
      <Link to="/"> Home </Link> | { " " }
      <Link to="/about"> About Us </Link>
    </nav>

    {/* Routes */}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
