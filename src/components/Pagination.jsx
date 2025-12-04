import './Pagination.css';
import { useNavigate } from 'react-router-dom';

export default function Pagination({page, url, hasNext}){
    const navigate = useNavigate();
    try{
        page = parseInt(page);
    }catch{
        page = 1;
    }
    return (
        <div className='pagination'>
            {page > 1 ? <button className="prev-btn" onClick={()=>{navigate(`${url}${page - 1}`)}}>{"<"}</button> 
            : <div></div>}
            <span className="page-number">page <strong>{page}</strong></span>
            {hasNext ? <button className="next-btn" onClick={()=>{navigate(`${url}${page + 1}`)}}>{">"}</button>
            : <div></div>}
        </div>
    )
}