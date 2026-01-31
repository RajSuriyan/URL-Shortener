
import { Navigate } from "react-router-dom";

export function handle403(response:number){
    if (response > 200) {
    return <Navigate to="/login" replace={true} />;
    }
}


