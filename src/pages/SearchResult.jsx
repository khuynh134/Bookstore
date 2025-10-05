import { useParams } from 'react-router-dom';
import './SearchResult.css'

export default function SearchResult(){
    let searchQuery = useParams().query
    return (
        <div>
            <h2>
                Searching for books contain {searchQuery}...
            </h2>
        </div>
    );
}