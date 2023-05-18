import React,{useState} from "react";
import SirovineEdit from "./SirovineEdit";
import Select from "./Select";
const AzurirajSirovinu = ({azuriraj,props,role})=>{
    const[nazad, setNazad]=useState(0)
    const[idDobavljaca, setIdDobavljaca]=useState(azuriraj.idDobavljaca);
    const[messages,setMessages]=useState('');
    const[errorMessages,setErrorMessages]=useState('');
   
    const URL_Dobavljac='/dajImeDobavljacaIdReact';
    const promena=(id)=>{
        setIdDobavljaca(id) //vraca odabrani id dobavlajcaiz selecta
     };
    const fun=()=>{
        const ime = document.getElementById('ime').value;
        
      //  document.getElementById('ime').setAttribute('disabled',true);
        const cena = document.getElementById('cena').value;
        
     //   document.getElementById('cena').setAttribute('disabled',true);
        const idSirovine =azuriraj.idSirovine;
        
        
        
        if(Number(cena) !== azuriraj.cenaSirovine){
            setMessages(`ste premenili cenu u ${cena}`)
           
        }
        if(idDobavljaca !== azuriraj.idDobavljaca){
            setMessages(`ste promenili dobavljaca sa id-em: ${idDobavljaca}`)
        }
        setTimeout(function(){ 
            setNazad(1) },3000);    
            
        fetch('/azurirajSirovinuReact', {
            method: 'POST',
				headers: {
                    
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ //moramo poslati u JSON formatu
					imeSirovine : ime,
                    cenaSirovine: Number(cena),
                    idDobavljaca: idDobavljaca,
                    idSirovine : idSirovine
				})
			})
            .then((res) =>{
                if(res.status===200){return res.json()}
               
            })
            .then((response)=>{
                if(response.error){
                    return setErrorMessages(response.poruka)}
                else{
                    if(ime !== azuriraj.imeSirovine){
                        return setMessages(`Za sirovinu ${azuriraj.imeSirovine} ste promenili ime u  `+response)
                    }
                    if(Number(cena) !== azuriraj.cenaSirovine){
                        return setMessages(`Za sirovinu ${response} ste promenili cenu u ${cena}.`)
                    }
                    if(idDobavljaca !== azuriraj.idDobavljaca){
                        return setMessages(`Za sirovinu ${response} ste promenili dobavljaca. `)
                    }
                
                }
            }).catch((error)=>{console.log("ERROR : ",error)});      
    }
    const vrati = ()=>{
        return(
            <div>
                {errorMessages ==='' ? 
            <div className="container">
                <div className="col-sm-12">
                {messages !== '' ? 
                    <div className="alert alert-success alert-dismissible">
                        <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                       {messages}
                </div> : null
            }            
                <ul className="nav nav-tabs actions-nav">
                    <li>
                        <button className="btn btn-default" onClick={()=>{setNazad(1)}} >List</button>
                    </li>
                    <li className="active">
                        <button className="btn btn-default" >Azuriraj</button>
                    </li>
                 </ul> <br></br><br></br>
                </div>
                <div className="form-group"> 
                    <label className=" control-label">Naziv sirovine</label>
                    <div className="row">
                    <div className="col-sm-12">
                        <input id="ime" defaultValue={azuriraj.imeSirovine} className="form-control" />
                    </div>
                    </div>
                </div>
                <br></br><br></br>
                <div className="form-group">  
                    <label className=" control-label">Cena sirovine</label>
                    <div className="row">
                    <div className="col-sm-12">
                        <input id="cena" type='number' defaultValue={azuriraj.cenaSirovine} className="form-control" />
                    </div>
                    </div>
                </div>
                <br></br><br></br>
                <div className="form-group">
                    <div >
                        <Select 
                        role={role}
                        className='form-control'
                            promena={promena}
                            options={URL_Dobavljac} 
                           ime={azuriraj.imeDobavljaca}
                        />
                    </div>
                </div>
                <br></br><br></br>
                <div className="col-sm-12 text-center">
                    <button onClick={()=>{fun()}}>Azuriraj</button>
                </div>
                 
            </div>
                :
                <div className="alert alert-success alert-dismissible">
                    <p className="close" data-dismiss="alert" aria-label="close">&times;</p>
                     <strong>{errorMessages}</strong> 
                </div>
                    }

            </div>
        )
    }
    return(
        <div>
            {nazad === 0 ? vrati()   : <SirovineEdit role={role} props={props} /> }
        </div>
    );
};

export default AzurirajSirovinu;