import { useState } from "react"
import KreirajKolac from "./KreirajKolac"
const NapraviKolac=({token,role})=>{
    const[nazad, setNazad]=useState(0)
    const[imeKolaca, setImeKolaca]=useState('')
    const[postupak, setPostupak]=useState('')
    const[poruka, setPoruka]=useState(0);
    const[mesages, setMesages]=useState('')
    const[errorMesagges, setErrorMesagges]=useState('')
 
    const sacuvajKolac=()=>{
        
        fetch('/napraviKolacReact', {
            method: 'POST',
				headers: {
                   
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ 
					imeKolaca : imeKolaca,
                    postupak : postupak
                })})
                .then((res) =>{
                    if(res.status===200){ return res.json()} 
                })
                .then((response)=>{
                    if(response.error){return setErrorMesagges(response.poruka)
                    }else{
                        return setMesages(response)
                    } })
                .catch((error)=>{return console.log(error)});
			
        setTimeout(function(){
            setNazad(1)
        },3000)
        setPoruka(1)
    }
    const Kreiraj=()=>{
       
    return(
        <div className="row">
            {poruka === 1 ?
               <div className="alert alert-success alert-dismissible">
               <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
               {mesages}
           </div> : null} 
        
            <div className="col-sm-12 text-center">
                <h2>Kreiraj kolac</h2>
            </div>
            <div className="row">
            <ul className="nav nav-tabs actions-nav">
        		<li><button className="btn btn-default" onClick={()=>{setNazad(1)}}>Lista</button></li>
                <li className="active"><button className="btn btn-default">Kreiraj kolac</button></li>
                
            </ul>
            </div>
            <br></br>
            <div className="form-group">
                    
                    <label className=" control-label">Ime kolaca</label>
                    <div className="row">
                    <div className="col-sm-12">
                        <input  onChange={(e)=>setImeKolaca(e.target.value)}   className="form-control" />
                    </div>
                    </div>
                </div>
                <br></br><br></br>
                <div className="form-group">
                    
                    <label className=" control-label">Postupak</label>
                    <div className="row">
                    
                    <div className="col-sm-12">
                    <textarea onChange={(e)=>setPostupak(e.target.value)} type="text" className="form-control" rows="5" cols="30" ></textarea>
                    </div>
                    </div>
                </div>
                <br></br><br></br>
                { imeKolaca !== '' && postupak !=='' ?  
                <div className="col-sm-12 text-center">
                    <button  onClick={()=>sacuvajKolac()}>Sacuvaj</button>
                </div> : null}
        </div>
    )
    }
    return(
        <div>
            { errorMesagges === '' ? <>
            {nazad === 0? Kreiraj() : <KreirajKolac role={role} props={{token}} />}
            </> :
            <div className="alert alert-success alert-dismissible">
                <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                    <strong>{errorMesagges}</strong>
           </div> 
            }
        </div>
    )
}
export default NapraviKolac;