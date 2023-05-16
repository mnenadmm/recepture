import React from "react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import AzuriajRecKolac from "./AzuriajRecKolac";
const UrediRecepturu = ({props,token,role})=>{
const[stranica,setStranica]=useState(1)
const idKolaca=props.idKolaca;
const imeKolaca=props.imeKolaca
const[mesages, setMesages]=useState('');//ispisuje poruku o promeni
const[poruka, setPoruka]=useState(0);//koristi se da prikaze poruku kada je ima
const[kolicina, setKolicina]=useState(props.kolicina);
const[errorMessages,setErrorMessages]=useState('');


const promeni =()=>{
    console.log(kolicina)
    fetch('/azurirajKolicinuRecepturaReact', {
            method: 'POST',
				headers: {
                    
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ //moramo poslati u JSON formatu
					idKolaca:props.idKolaca,
                    idSirovine : props.idSirovine,/////////////////////////////////////////
                    kolicina : kolicina,
                    imeSirovine:props.imeSirovine
				})
			}).then((res)=>{
                if(res.status===200){return res.json()}
                if(res.status===10){return  setErrorMessages('Nemate pristup ovom delu aplikacije ')}
                if(res.status===20){return  setErrorMessages('Nesto nije u redu sa konekcijom ka bazi ')}
                if(res.status===401){return  setErrorMessages('Vasa sessija je istekla, konektujte se ponovo ERROR: 401 ')}
                if(res.status===422){return  setErrorMessages('Neregularna konakcija, molimo Vas da se ispravno konektujete konektujete  ERROR: 422 ')}
            }).then((response)=>{
                console.log(response)
            }).catch((error)=>{console.log('ERROR: ',error)})
            setPoruka(1)
            setMesages(`Za sirovinu ${props.imeSirovine} je promenjena kolicina u ${kolicina}`)
            setTimeout(function(){
                setStranica(0)
            },3000)
   
}
const navigate = useNavigate();

    const uredi=()=>{
        return(
            <div>
                { errorMessages === ''? 
               <div>
                {poruka !==0 ? 
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
                            <li>
                                <button className="btn btn-default" onClick={()=>setStranica(0)}>Lista kolaca</button>
                            </li>
                            <li className="active">
                                <button className="btn btn-default" >Sirovina</button>
                            </li>
                        </ul>
                    </div>
                    
                    <div className="col-sm-12">
                    <br/><br/>
                        <input className="form-control" defaultValue={props.imeSirovine} disabled/>
                    </div>
                    
                    <div className="col-sm-12">
                    <br/><br/>
                    <input className="form-control" type='number' onChange={(e)=>setKolicina(e.target.value)} defaultValue={props.kolicina} />
                    </div>
                    <div className='row'>
                <div className='col-sm-12 text-center'><br/><br/>
                <button onClick={()=>promeni()} type="button" className="btn btn-info">Sacuvaj</button>
                </div>
            </div>
            <br/>
                <div className="col-sm-4" > <button type="button" onClick={()=>navigate(-1)}>Nazad</button>
                </div> 
            </div>
                    : 
                <div className="alert alert-success alert-dismissible">
                    <p className="close" data-dismiss="alert" aria-label="close">&times;</p>
                <strong>{errorMessages}</strong>
                </div>}
            </div>
           
        )
    };
    return(
        <div>
          {stranica===1 ? uredi() : <AzuriajRecKolac role={role}  token={token} props={{idKolaca,imeKolaca}} />}
          
           
        </div>
    )

}
export default UrediRecepturu;