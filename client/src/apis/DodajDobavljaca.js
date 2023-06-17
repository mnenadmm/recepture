import { useState } from "react";
import DobavljaciEdit from "./DobavljaciEdit";

const DodajDobavljaca=({token,role})=>{
    const[list, setList]=useState(1)
    const[mesages, setMesages]=useState('')
    const[errorMesagges,setErrorMesagges]=useState('');
    const[errorMesaggesDobavljac,setErrorMesaggesDobavljac]=useState('')
    const[imeDobavljaca, setImeDobavljaca]=useState('')
    const[emailDobavljaca, setEmailDobavljaca]=useState('')
    const[adresa,setAdresa]=useState('')
    const[telefonDobavljaca, setTelefonDobavljaca]=useState(0)
    const snimi=()=>{
        fetch('/dodajDobavljacaReact', {
            method: 'POST',
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ //moramo poslati u JSON formatu
					imeDobavljaca : imeDobavljaca,
                    emailDobavljaca : emailDobavljaca,
                    telefonDobavljaca : telefonDobavljaca,
                    adresa : adresa
				})
			}).then((res) =>{ //setMesages(`Dodali ste dobavljaca : ${imeDobavljaca}.`)
            if(res.status===200){ return res.json()}
            }).then((response)=>{
                if(response.error){return setErrorMesagges(response.poruka)}
                else if(response.errorDobavljac){
                    setErrorMesaggesDobavljac(response.poruka)
                }
                else{
                    setMesages(response)
                }
            })
        setTimeout(function(){
            setList(0)
        },5000)
        
        
        
        
    }
    const sacuvajDobavljaca=()=>{
    
        return(
            <div>
                {errorMesagges ==='' ? 
                <> 
                <div className="row">
                {mesages !== '' ? 
                    <div className="alert alert-success alert-dismissible">
                        <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                         {mesages}
                </div> : null
            }

                    <div className="col-sm-12 text-center">
                        <h2>Dodaj dobavljaca</h2>
                    </div>
                </div>
            <br /><br />
            <div className="row">
                <div className="col-sm-4" ></div>
                <div className="col-sm-4">
                    <label>Unesiteime dobavljaca</label>
                    <input onChange={(e)=>setImeDobavljaca(e.target.value)} id='imeDobavljaca' className="form-control" />
                    {errorMesaggesDobavljac!== ''? <p style={{color:'red'}}>{errorMesaggesDobavljac}</p>  : null} 
                </div>
            </div>
            <br /><br />
            <div className="row">
                <div className="col-sm-4" ></div>
                <div className="col-sm-4">
                    <label>Email:</label>
                    <input onChange={(e)=>setEmailDobavljaca(e.target.value)}  type="email" className="form-control" />
                </div>
            </div>
            <br /><br />
            <div className="row">
                <div className="col-sm-4" ></div>
                <div className="col-sm-4">
                    <label>Telefon:</label>
                    <input onChange={(e)=>setTelefonDobavljaca(e.target.value)} type="tel" className="form-control" />
                </div>
            </div>
            <br />
            <div className="row">
                <div className="col-sm-4" ></div>
                <div className="col-sm-4">
                    <label>Adresa:</label>
                    <input onChange={(e)=>setAdresa(e.target.value)} className="form-control" />
                </div>
            </div>
            <div className="col-sm-4">
            <br /><br />
            <button type="button" className="btn btn-info" onClick={()=>setList(0)}>Back</button>
            </div>
            
            
            { imeDobavljaca !=='' && emailDobavljaca !=='' && telefonDobavljaca !==0 ?
            <div className="row">
                <div className="col-sm-12 text-center">
                    <button  onClick={()=>{snimi()}} type="button" className="btn btn-primary">Sacuvaj</button>
                </div>
            </div> : null }
            </>:
            <div className="alert alert-success alert-dismissible">
            <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
             {errorMesagges}</div> }
            </div>     
        )
    }
    return(
        <div>
            {list===1? sacuvajDobavljaca() : null}
            {list ===0 ? <DobavljaciEdit role={role} props={{token}} /> : null}
            
        </div>
    )
    
}
export default DodajDobavljaca;