import { Link } from "react-router-dom";
import './AuthorLinks.css'

export default function AuthorLinks({authors}){
    const element = [];
    if(authors && authors.length != 0){
        element.push("Author: ");
        for (let i = 0; i < authors.length; i++){
            element.push(
                <Link className="author_link" key={authors[i].AuthorID} to={`/author/${authors[i].AuthorID}`}>
                    {authors[i].AuthorName}
                </Link>
            );
            // the commas and space between multiple authors
            if(i != authors.length - 1) {
                element.push(", ");
            }
        }
    }
    return <p className="author_links">{element}</p>;
}