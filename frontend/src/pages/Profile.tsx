import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";
function Profile(){
    const [click,onClicked] = useState(false);

    const onChange = async () =>{
        onClicked(true);
       setTimeout(()=>{onClicked(false)},1000);
    }

    return (
        <ProtectedRoute>
        <div className="flex justify-center items-center">
            
        </div>
        </ProtectedRoute>
    )
}

export default Profile;