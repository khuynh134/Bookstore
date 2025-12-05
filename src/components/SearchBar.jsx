import './SearchBar.css';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar(){
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    function handleSubmit(e){
        e.preventDefault();
        if (!searchQuery){
            alert("Search query cannot be empty.");
            return;
        }else if(searchQuery.length < 2){
            alert("Search query should be at least 2 characters.");
            return;
        }
        navigate(`/s/${encodeURIComponent(searchQuery)}/1`);
    };

    return (
        <form className="search-form" onSubmit= {handleSubmit}>
            <input type="text" placeholder="Book Title..." onChange={(e) => setSearchQuery(e.target.value.trim())}>
            </input>
            <button type="submit">
                Search
            </button>
        </form>
    );
}