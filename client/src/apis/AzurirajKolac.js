import { useState } from "react"
import KreirajKolac from "./KreirajKolac";
const AzurirajKolac=({props,token,role})=>{
    const [nazad, setNazad]=useState(0);
    const[poruka, setPoruka]=useState(0);
    const[mesages, setMesages]=useState('');
    const[errorMessages,setErrorMessages]=useState('');
    const promeniKolac=()=>{
        const imeKolaca = document.getElementById('imeKolaca').value;
        const objasnjenje = document.getElementById('objasnjenje').value;
        fetch('/azurirajKolacReact', {
            method: 'POST',
				headers: {
                    
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ //moramo poslati u JSON formatu
					idKolaca : props.idKolaca,
                    imeKolaca : imeKolaca,
                    postupak : objasnjenje
				})
			}).then((res) =>{
            
                if(res.status===200){ return res.json()}
               if(res.status===401){return  setErrorMessages('Vasa sessija je istekla, konektujte se ponovo ERROR: 401 ')}
               if(res.status===422){return  setErrorMessages('Neregularna konakcija, molimo Vas da se ispravno konektujete konektujete  ERROR: 422 ')}
               if(res.status===10){return setErrorMessages("Nemate ovlascenje da azurirate kolace")}
            }).then((response) => { 
                if(response.status===200){console.log(response)}
                
                
            }).catch(error=>{
                setErrorMessages('Nemate ovlascenje da azurirate kolace')
                console.log('ovo je greska ',error)
                
            })
            if(imeKolaca !== props.imeKolaca){
                setMesages(`Promenili ste ime kolaca u ${imeKolaca}`)
            }
            if(objasnjenje !== props.objasnjenje){
                setMesages(`Promenili ste postupak za kolac ${imeKolaca}`)
            }
            setPoruka(1)
            setTimeout(function(){
                setNazad(1) //vraca nas u listu kolaca
            },3000)
            
    }
    const Azuriraj=()=>{
    return(
        <div>
        {errorMessages ==='' ?
        <div>
            {poruka ===1 ? 
                        <div className="alert alert-success alert-dismissible">
                            <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                            {mesages}
                        </div> : null}
            <div className="col-sm-12 text-center">
                <h2>Lista kolaca</h2>
            </div>
            <div>
                <ul className="nav nav-tabs actions-nav">
                    <li><button className="btn btn-default" onClick={()=>setNazad(1)} >Lista</button></li>
                    <li  className="active">
                        <button className="btn btn-default">Azuriraj kolac</button>
                        </li>
                </ul>
            </div>
            <br></br><br></br>
            <div className="form-group">
                    
                    <label className=" control-label">Ime kolaca</label>
                    <div className="row">
                    <div className="col-sm-12">
                        <input defaultValue={props.imeKolaca} id='imeKolaca'  className="form-control" />
                    </div>
                    </div>
                </div>
                <br></br><br></br>
                <div className="form-group">
                    
                    <label className=" control-label">Postupak</label>
                    <div className="row">
                    
                    <div className="col-sm-12">
                    <textarea type="text" id="objasnjenje" defaultValue={props.objasnjenje} className="form-control" rows="7" cols="30" ></textarea>
                    </div>
                    </div>
                </div>
                <br></br><br></br>
                <div className="col-sm-12 text-center">
                    <button onClick={()=>{promeniKolac()}}>Azuriraj</button>
                </div><br></br><br></br>
        </div>
               :
               <div className="alert alert-success alert-dismissible" >
                    <p className="close" data-dismiss="alert" aria-label="close">&times;</p>   
                    <strong>{errorMessages}</strong>
               </div> 
               }
        </div>
    )}
    return(
        <div>
            {nazad ===0 ? Azuriraj() : null}
            {nazad ===1 ? <KreirajKolac role={role}  props={{token}} /> : null}
           
            
        </div>
    )
}
export default AzurirajKolac;