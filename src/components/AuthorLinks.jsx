import { Link } from "react-router-dom";
import './AuthorLinks.css'

export default function AuthorLinks({authorIDs, authorNames}){
    const element = [];
    if(authorIDs && authorIDs.length != 0 && authorNames && authorNames.length == authorIDs.length){
        element.push(<b>By: </b>);
        for (let i = 0; i < authorIDs.length; i++){
            element.push(
                <Link className="author_link" key={authorIDs[i]} to={`/author/${authorIDs[i]}`}>
                    {authorNames[i]}
                </Link>
            );
            // the commas and space between multiple authors
            if(i != authorIDs.length - 1) {
                element.push(", ");
            }
        }
    }
    return <p className="author_links">{element}</p>;
}