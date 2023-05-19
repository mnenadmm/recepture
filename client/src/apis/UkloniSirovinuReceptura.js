import { useState } from "react"
import AzuriajRecKolac from "./AzuriajRecKolac"
import { useNavigate } from 'react-router-dom';

const UkloniSirovinuReceptura=({props,token,role})=>{
    const[stranica, setStranica]=useState(2)
    
    const[mesages, setMesages]=useState('')
    const[errorMessages,setErrorMessages]=useState('');
    let idKolaca=props.idKolaca;
    let imeKolaca=props.imeKolaca;

    const navigate = useNavigate();
    
    const Ukloni =()=>{
        const ukloniSirovinu =()=>{
            
            fetch('/ukloniSirovinuRecepturaReact', {
            method: 'POST',
				headers: {
                    
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ //moramo poslati u JSON formatu
					idKolaca:props.idKolaca,
                    idSirovine : props.idSirovine,
                    imeSirovine:props.imeSirovine
				})
			}).then((res)=>{
                if(res.status===200){return res.json()}
            }).then((response)=>{
                if(response.error){return setErrorMessages(response.poruka)
                }else{
                    return setMesages(response)
                }
            }).catch((error)=>{ console.log("ERROR: ",error)})
            
            
            setInterval(() => {
               setStranica(0) 
            }, 3000);
        }
        
        return(
            <div>
                {errorMessages ==="" ?
            <div> 
                {mesages !== '' ? 
                    <div className="alert alert-success alert-dismissible">
                        <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                        {mesages}
                </div> : null
            }
                <div className="col-sm-12 text-center">
                        <h2>{props.imeKolaca}</h2>
                        
                    </div>
                    <div className="col-sm-12">
                        <ul className="nav nav-tabs actions-nav">
                            <li><button className="btn btn-default" onClick={()=>setStranica(0)}>List</button></li>
                            <li className="active"><button className="btn btn-default">Obrisi Sirovinu</button></li>
                        </ul>
                    </div>
                    
                    <div className="row">
                        <div className="col-sm-4"></div>
                        <div className="col-sm-4"><br /><br />
                        <label>Sirovina :</label>
                            <input className="form-control text-center" disabled defaultValue={props.imeSirovine} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-4"></div>
                        <div className="col-sm-4"><br /><br />
                            <label>Kolicina :</label>
                            <input className="form-control text-center" disabled defaultValue={props.kolicina} />
                        </div>
                    </div><br /><br />
                    <div className="col-sm-12">
                        <h3 style={{color:'red'}}>Da li ste sigurni da zelite da uklonite sirovinu iz recepture za kolac <strong>{props.imeKolaca}</strong> ?</h3>
                    </div>
                    <div className='row'>
                <div className='col-sm-12 text-center'><br/><br/>
                <button  type="button" onClick={()=>ukloniSirovinu()} className="btn btn-info">Obrisi</button>
                </div>
            </div>
            <br/>
                <div className="col-sm-4" > <button type="button" onClick={()=>navigate(-1)}>Nazad</button>
                </div> 
                
            </div>
                : 
                <div className="alert alert-success alert-dismissible">
                         <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                        <strong>{errorMessages}</strong>
                </div>}
            </div>
        
   )
    }
    return(
        <div>
            {stranica===2 ? Ukloni() : <AzuriajRecKolac role={role} token={token} props={{idKolaca,imeKolaca}}/>}
        </div>
    )

}
export default UkloniSirovinuReceptura;