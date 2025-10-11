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
        <p>Fiction</p>
        <button class="butn">Browse</button>
    </div>
    <div class="tile">
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
      </div>
     </div>
    );
}

export default Home;