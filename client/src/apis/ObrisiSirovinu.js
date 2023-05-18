import { useState } from "react"
import SirovineEdit from "../components/SirovineEdit"
const ObrisiSirovinu=({props,role,azuriraj})=>{
    const[errorMessages,setErrorMessages]=useState('')
    const[messages, setMessages]=useState('')
    const[stranica, setStranica]=useState(0)
    const[poruka, setPoruka]=useState(0);   
    const obrisi=()=>{
        const ukloni =()=>{
            fetch('/obrisiSirovinu', {
             method: 'POST',
                 headers: {
                   
                     'Accept': 'application/json, text/plain, */*',
                     'Content-Type': 'application/json'
                 },
                 body: JSON.stringify({ //moramo poslati u JSON formatu
                     idSirovine : azuriraj.idSirovine
                 })
             }).then((res)=>{
                if(res.status===200){return res.json()}
             }).then((response)=>{
                if(response.error){
                    return setErrorMessages(response.poruka)
                }else{
                    return setMessages(`${response} ${azuriraj.imeSirovine}.`)
                }
                
             }).catch((error)=>{console.log('ERROR: ',error)})
             setPoruka(1);//ispisuje alertporuku
             setTimeout(function(){ 
                setStranica(1) },5000);
        }  

    return(
        <div>
            {errorMessages ==='' ? 
        <div className="container">
            <div className="col-sm-12">
            {poruka !== 0 ? 
                    <div className="alert alert-danger">
                        <p className="close" data-dismiss="alert" aria-label="close">&times;</p>
                        {messages} 
                </div> : null
            }
                <ul className="nav nav-tabs actions-nav">
        		    <li>
                        <button className="btn btn-default" onClick={()=>setStranica(1)} >List</button>
                    </li>
                    <li className="active">
                        <button className="btn btn-default">Obrisi</button>
                    </li>
                </ul> <br></br><br></br>
            </div>
            <div className="form-group">
                    
                    <label className=" control-label">Naziv sirovine</label>
                    <div className="row">
                    <div className="col-sm-12">
                        <input id="ime" defaultValue={azuriraj.imeSirovine} disabled  className="form-control" />
                    </div>
                    </div>
                </div>
                <br></br><br></br>
                <div className="form-group">
                    
                    <label className=" control-label">Cena sirovine</label>
                    <div className="row">
                    <div className="col-sm-12">
                        <input id="cena"defaultValue={azuriraj.cenaSirovine} disabled  className="form-control" />
                    </div>
                    </div>
                </div><br></br><br></br>
                <div className="col-sm-12 text-center">
                    <button type="button"
                         className="btn btn-danger" 
                         onClick={()=>ukloni()} 
                         >Obrisi
                    </button>
                </div>
        </div>
            :
            <div className="alert alert-success alert-dismissible">
                <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                    <strong>{errorMessages}</strong>

            </div>
                }

        </div>
    )}
    return(
        <div>
            {stranica===0 ? obrisi() : <SirovineEdit role={role} props={props} />}
            </div>
        
    )
}
export default ObrisiSirovinu;