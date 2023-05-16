import { useState } from 'react';
import DobavljaciEdit from "./DobavljaciEdit";

const ObrisiDobavljaca=({role,token,props})=>{
    const[list,setList]=useState(4)
   
   // 
   console.log('Ne razumem'); 
    const Obrisi=()=>{  
        <div>
            <h1>aaaaaaaaaaaaaaaaaa</h1>
        </div>

    }
    return(
        <div>
            {list ===4 ? Obrisi() : null}
            {list ===0 ? <DobavljaciEdit role={role} props={props} /> : null}
        </div>
    )

}
export default ObrisiDobavljaca;