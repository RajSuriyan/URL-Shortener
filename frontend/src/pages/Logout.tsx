import api from "@/api";
import { useAuth } from "@/context/useAuth";
import { useEffect, useState } from "react";
function Logout(){
    const [click,onClicked] = useState(false);
    const {setLoading,setLoggedIn} = useAuth();
    const onChange = async () =>{
       onClicked(true);
       try{
        setLoading(true);
       await api.get("/auth/logout")
        setLoggedIn(false);
       }catch(err){
        console.log(err);
       }finally{
        setLoading(false);
        setLoggedIn(false);

        window.location.href= "/"
       }
       setTimeout(()=>{onClicked(false)},1000);
    }
    useEffect(()=>{onChange()});

    return (
        <></>
    )
}

export default Logout;