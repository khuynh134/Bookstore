import './Pagination.css';

export default function Pagination({page, setPage, hasNext}){
    return (
        <div className='pagination'>
            {(page != 1) ? <button className="prev-btn" onClick={()=>{setPage(page - 1)}}>Prev</button> 
            : <div></div>}
            <span className="page-number">page <strong>{page}</strong></span>
            {hasNext? <button className="next-btn" onClick={()=>{setPage(page + 1)}}>Next</button>
            : <div></div>}
        </div>
    )
}