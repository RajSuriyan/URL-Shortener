import { useState } from "react";

function NotFound(){
    const [click,onClicked] = useState(false);
    const onChange = async () =>{
        onClicked(true);
       setTimeout(()=>{onClicked(false)},1000);
    }

    return (
        <div className="flex justify-center">
            <h1 onClick={onChange} className={ (click!==true) ? "inline-block font-extrabold text-9xl justify-center px-6 py-2 hover:animate-pulse text-amber-400 bg-black" :" inline-block font-extrabold text-9xl justify-center px-6 py-2 animate-spin text-amber-400 bg-black"}>
               Not found
            </h1>
        </div>
    )
}

export default NotFound;