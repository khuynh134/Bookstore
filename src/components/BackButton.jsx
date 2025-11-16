import { useNavigate } from "react-router-dom";
import './BackButton.css';

// button to go back to last page
export default function BackButton(){
    const navigate = useNavigate();
    return (
        <button className="back-button" onClick={()=>{navigate(-1)}}>
            {"<"} Back
        </button>
    );
}