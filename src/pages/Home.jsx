import './Home.css';
function Home() {
    return (
        <div>
             
        <div className="home-container">
            <h1 className="home-title">Hello, Nice to meet you!</h1>
            <p className="home-description">Explore the amazing inventory of books we have!</p>

        </div>
        <div className="parallax"></div> 
        <div class="tile-container">
        
    <div class="tile">
    <img src ="/public/harrypotter.jpg " alt= "Ficton Novels" className="tile-img"/>
        <p>Fiction</p>
        <button class="butn">Browse</button>
    </div>
    <div class="tile">
    <img src ="/public/nonfiction.jpg " alt= "Non-Fiction Books" className="tile-img"/>
        <p>Non-Fiction</p>
        <button class="butn">Browse</button>
    </div>

    <div class="tile">
    <img src ="/public/spider_comic.jpg " alt= "Comics and Graphic Novels" className="tile-img"/>
        <p>Comics & Graphic Novels</p>
        <button class="butn">Browse</button>
    </div>

    <div class="tile">
        <img src ="/public/corduroy.jpg " alt= "Children's books" className="tile-img"/>
        <p>Children's Books</p>
        <button class="butn">browse</button>
       </div>

       <div class="tile">
    <img src ="/public/young_adult.jpg " alt= "Young-Adult" className="tile-img"/>
        <p>Young Adult</p>
        <button class="butn">Browse</button>
    </div>

    <div class="tile">
    <img src ="/public/Academic_book.jpg" alt= "Textbooks & Academics" className="tile-img"/>
        <p>Textbooks & Academics</p>
        <button class="butn">Browse</button>
    </div>
      </div>
     </div>
    );
}

export default Home;