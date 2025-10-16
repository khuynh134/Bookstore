import { Link } from "react-router-dom";

export default function AuthorLinks({authors}){
    const element = [];
    if(authors && authors.length != 0){
        element.push("Author: ");
        for (let i = 0; i < authors.length; i++){
            element.push(
                <Link key={authors[i].AuthorID} to={`/author/${authors[i].AuthorID}`}>
                    {authors[i].AuthorName}
                </Link>
            );
            // the commas and space between multiple authors
            if(i != authors.length - 1) {
                element.push(", ");
            }
        }
    }
    return <p>{element}</p>;
}