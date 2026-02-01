import api from "@/api";
import { useAuth } from "@/context/useAuth";
import { useEffect } from "react";
function Logout(){
    const {setLoading,setLoggedIn} = useAuth();
    const onChange = async () =>{
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
    }
    useEffect(()=>{onChange()});

    return (
        <></>
    )
}

export default Logout;