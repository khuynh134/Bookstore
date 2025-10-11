import './SearchBar.css';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar(){
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    function handleSubmit(e){
        e.preventDefault();
        if (!searchQuery) return;
        navigate(`/s/${encodeURIComponent(searchQuery)}`);
    };

    return (
        <form className="search-form" onSubmit= {handleSubmit}>
            <input type="text" placeholder="Book Title..." onChange={(e) => setSearchQuery(e.target.value)}>
            </input>
            <button type="submit">
                Search
            </button>
        </form>
    );
}