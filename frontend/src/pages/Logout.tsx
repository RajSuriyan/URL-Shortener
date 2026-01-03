import { useState } from "react";

function Logout(){
    const [click,onClicked] = useState(false);
    const onChange = () =>{
       onClicked(true);
       setTimeout(()=>{onClicked(false)},1000);
    }

    return (
        <h1 onClick={onChange} className={ (click!==true) ? "flex font-extrabold text-9xl justify-center py-2 hover:animate-pulse text-amber-400 bg-black" :"flex font-extrabold text-9xl justify-center py-2 animate-spin text-amber-400 bg-black"}> 
            Hello World!!
        </h1>
    )
}

export default Logout;