import './About.css';
import aboutImage from '../assets/aboutusbookstack.jpeg';
function About() {
    return (
        <><div className="about-container">
            <h1 className="About-title">About Us </h1>

            <div className="about-content">
                <div className="about-text">
                    <h2 className="About-subtitle"> Our team members: Kathy Huynh, Ying Huang, and Valeria Campos</h2>
                    <p className="About-description"> Welcome to our website! Are you interested in exploring different books?
                        We have a large collection of books that is perfect for book lovers like you. Feel free to browse throught our collection and add your favorite books to your cart.
                    </p>

                </div>
                <img src={aboutImage} alt="About Us Image" className="about-image" />

            </div>
        </div><footer className="page-footer"> © 2025 Bookstore. All rights reserved.</footer></>
    );
}

export default About; 