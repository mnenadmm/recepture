import React, { useState} from "react";
import { useNavigate } from 'react-router-dom';
import Select from "./Select";

const DodajSirovinu = ({props,role})=>{
    const[errorMesagges,setErrorMesagges]=useState('');
    
    const[messages, setMessages]=useState('')
    const[cena, setCena]=useState([]);
    const[ime, setIme]=useState('');
    const[idDobavljaca, setIdDobavljaca]=useState(0);
    const[errorMesaggesSirovina, setErrorMesaggesSirovina]=useState('')
   
    const URL_Dobavljac = '/dajImeDobavljacaIdReact';
    let istorija = useNavigate();
    //funkcija koja je prosledjena u Select i koja vracaselektovani id dobavljaca
    const promena=(id)=>{
        if(id>0){
            setIdDobavljaca(id)  
        }   
    }
    //kada se klikne na dugme kupi sve stejtove i nakon toga iz resetuje
    const submit = ()=>{
        
        fetch('/dodajSirovinuReact', {
            method: 'POST',
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ //moramo poslati u JSON formatu
					imeSirovine : ime,
                    cenaSirovine: cena,
                    idDobavljaca: idDobavljaca
				})
			})
            .then((res) =>{ //setMessages(`Dodali ste sirovinu : ${ime}, cena : ${cena}.`)
                if(res.status===200){ return res.json()}  
            })
            .then((response)=>{
                if(response.error){ setErrorMesagges(response.poruka)}
                else if(response.errorSirovina){
                    setErrorMesaggesSirovina(response.poruka)
                   
                }else{
                    setMessages(response)
                }
            });
          
            
            setTimeout(function(){ 
                istorija(-1); //vraca korak nazad u navigaciji 
            },3000);
    }
    const dodaj=()=>{
        return(<div className="container">
                    <div className="row">
                        <div className="col-sm-12 text-center">
                            <h2>Dodaj sirovinu</h2>
                        </div>
                {errorMesagges !== ''? 
                    <div className="col-sm-12">
                        <br />
                        <div className="alert alert-success alert-dismissible">
                            <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                            {messages}
                        </div>
                    </div> : null}
                        <br></br><br></br>
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                        <label>Unesite ime sirovine</label>
                        <input type="text" value={ime}  className="form-control" onChange={(e)=>{setIme(e.target.value)}}></input>
                      
                    
                    {errorMesaggesSirovina!== ''? <p style={{color:'red'}}>{errorMesaggesSirovina}</p>  : null}  
                    </div>
                    </div>
                    <br></br><br></br>
        <           div className="row">
                        <div className="col-sm-4"></div>
                        <div className="col-sm-4">
                            <label>Unesite cenu</label>
                            <input type="number" value={cena} className="form-control" onChange={(e)=>{setCena(e.target.value)} } ></input>
                        </div>
                    </div>
                    <br></br><br></br>
                    <div className="row">
                          
                        <div className="col-sm-12">
                            { ime !== '' && cena !== 0   ? 
                                <Select  
                                   
                                    promena={promena} //prosledjujemo funkciju
                                    options={URL_Dobavljac} //prosledjujemo endpoint
                                    
                                    setErrorMesagges={setErrorMesagges}
                                    ime='Izaberite dobavljaca...'//prosledjujemo ime
                                />
                            : null}  
                        </div>
                    </div>
                    <br></br><br></br>
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4 text-center">
                        {cena > 0 && ime !==''   && idDobavljaca !==0 ?
                            <button id="btn" className="btn btn-primary" type="submit" 
                                onClick={submit}>
                                Submit
                            </button> 
                        : null}
                    </div>
                </div>)}
    return(
        <div>
            {errorMesagges === '' ? dodaj() : 
                <div className="alert alert-success alert-dismissible">
                    <p onClick={e=>e.preventDefault()} className="close" data-dismiss="alert" aria-label="close">&times;</p>
                    <strong>{errorMesagges}</strong>
                </div> }
        </div>
    );
};
export default DodajSirovinu;