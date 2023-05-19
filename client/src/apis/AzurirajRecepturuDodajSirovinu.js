import AzuriajRecKolac from "./AzuriajRecKolac"
import { useState } from "react"
import DodajURecepturu from "./DodajURecepturu"
import { useNavigate } from 'react-router-dom';
const AzurirajRecepturuDodajSirovinu = ({props,token,role})=>{
    const idKolaca=props.idKolaca
    const imeKolaca= props.imeKolaca;
    const[kolicina, setKolicina]=useState(0)
    const[idSirovine, setIdSirovine]=useState(0)
    const[poruka, setPoruka]=useState(0)
    const[mesages, setMesages]=useState('')
    const[errorMessages,setErrorMessages]=useState('')
    const[stranica, setStranica]=useState(5)
    const navigate = useNavigate();
    const vrednost = (e)=>{
        setKolicina(e);
    }
    const dodajSirovinu=(e)=>{
        setIdSirovine(e)
    }
    
    const dodajURecepturu=()=>{
    fetch('/dodajSirovinuURecepturu', {
        method: 'POST',
            headers: {
                
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ //moramo poslati u JSON formatu
                idKolaca : idKolaca,
                kolicina: kolicina,
                idSirovine : idSirovine,  
            })
        })
        .then((res=>{
            if(res.status===200){return res.json()}
        }))
        .then((response=>{
            if(response.error){return setErrorMessages(response.poruka)
            }else{
                return setMesages(response)
            }
            
           
        }))
        .catch((error)=>console.log(error))

        setPoruka(1)
        
        setTimeout(function(){
            setStranica(0)
        },3000)
        
    }
    const novaReceptura=()=>{
    return(
        <div>
            
            {poruka ===1 ? 
                        <div className="alert alert-success alert-dismissible">
                            <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                            {mesages}
                        </div> : null}
            <div className="row">
                <div className="col-sm-12 text-center">
                    <h2>{props.imeKolaca}</h2>
                    
                </div>  
            </div><br />
            <div className="col-sm-4" > 
                <button type="button" className="btn btn-primary" onClick={()=>navigate(-1)}>Back</button>
            </div>
           <br /><br />    <br />
           
        </div> 
    )
}
 return(
    <div>{errorMessages === '' ? <>
        
        {stranica===5 ? novaReceptura () :null}
            {stranica===5 ? <DodajURecepturu role={role} token={token}  props={{dodajSirovinu,vrednost}} /> :null }
        {stranica===5 && kolicina !==0 ? 
            <div className="col-sm-12 text-center"><br /><br /><br />
                <button className="btn btn-primary" onClick={()=>dodajURecepturu()}>Dodaj</button>
            </div>
         : null} 
         {stranica  === 0 ? <AzuriajRecKolac role={role} token={token} props={{idKolaca,imeKolaca}} /> :null} 
         </>:
         <div className="alert alert-success alert-dismissible">
         <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
             <strong>{errorMessages}</strong>
             </div>

         }
    </div>
 )}
export default AzurirajRecepturuDodajSirovinu;