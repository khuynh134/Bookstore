import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
    const navigate = useNavigate();
    const categories = [
        {title: "Children's Books", data: 'Childrens', image: "/corduroy.jpg ", alt: "Children's books"},
        {title: "Young Adult", data: 'Young Adult', image: "/hunger_game.jpg ", alt: "Young-Adult"},
        {title: "Adult", data: 'Adult', image: "/aThousand.jpg ", text: "Adult", alt: "adult"},
        {title: "Fiction", data: 'Fiction', image: "/harrypotter.jpg ", alt: "Fiction Novels"},
        {title: "Non-Fiction", data: 'Nonfiction', image: "/nonfiction.jpg ", alt: "Fiction Novels"},
        {title: "Comics & Graphic Novels", data: 'Comics', image: "/spider_comic.jpg ", alt: "Comics and Graphic Novels"},
        {title: "Romance", data: 'Romance', image: "/twilight.jpg", alt: "Romance"},
        {title: "Classics", data: 'Classics', image: "/oldManAndSea.jpg ", alt: "Classics"},
        {title: "Mystery", data: 'Mystery', image: "/holmes.jpg ", alt: "Mystery"}
    ];

    return (
        <div>
             
        <div className="home-container">
            <h1 className="home-title">Hello, Nice to meet you!</h1>
            <p className="home-description">Explore the amazing inventory of books we have!</p>

        </div>
        <div className="parallax"></div> 
        <div class="tile-container">
        
        {categories.map((category) => {
            return (
                <div class="tile">
                    <img src = {category.image} 
                    alt= {category.alt} 
                    className="tile-img"/>
                    <p>{category.title}</p>
                    <button class="butn" onClick={()=> {navigate(`/category/${category.data}`)}}>
                        Browse
                    </button>
                </div>
            );
        })}
    </div>
    </div>
    );
}

export default Home;