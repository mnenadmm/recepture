import Select from "../components/Select"
import { useState } from "react";

const DodajURecepturu=({props,token,role})=>{
    const[errorMesagges,setErrorMesagges]=useState('');
    const[cena,setCena]=useState(0)
    const[zbir, setZbir]=useState(0)
    const URL_sirovina = '/izlistaj/sirovine/react';
    
    const promena =(id)=>{
       
        if(id > 0){
        //console.log('sirovina ', id)
       
        const URL_ID = `/dajJednuSirovinuReact/${id}`;
        fetch(URL_ID,{
            method: "GET",
            headers: {
                
              }
        })
               .then((res) =>
                   res.json())
               .then((response) => { 
                   setCena(Number(response[1]));
                   
               })
               props.dodajSirovinu(Number(id))  
    }
    
    }
    const sacuvaj =(e)=>{
        setZbir(e)
        props.vrednost(e)
     }
    
     
    return(
        <div className="row">
            {errorMesagges}
            <div className="col-sm-4">
                <label>Cena kg {cena}</label>
                <Select setErrorMesagges={setErrorMesagges}  
                    promena={promena} 
                    token={token}  
                    options={URL_sirovina} 
                    role={role}
                    ime='Izaberite sirovinu..'/>
            </div>
            <div className="col-sm-4">
            <label>Unesite kolicinu</label>
                <input placeholder="kolicina" type="number" onChange={(e)=>sacuvaj(Number(e.target.value))} className="form-control" />
            </div>
             
            <div className="col-sm-4">
            <label>ukupno</label>
               <input className="form-control" value={cena*zbir}  disabled />
            </div> 
           

        </div>
    )
}
export default DodajURecepturu;