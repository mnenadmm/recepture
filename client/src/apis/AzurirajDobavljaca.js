import { useState } from 'react';
import DobavljaciEdit from "./DobavljaciEdit";
const AzurirajDobavljaca = ({props,token,role})=>{
    const[list, setList]=useState(2);
    const[mesages, setMesages]=useState('');//ispisuje poruku o promeni
    const promeni=()=>{
        const ime=document.getElementById('ime').value;
        const telefon = document.getElementById('telefon').value;
        const email = document.getElementById('email').value;
        const adresa = document.getElementById('adresa').value;
        fetch('/azurirajDobavljacaReact', {
            method: 'POST',
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ //moramo poslati u JSON formatu
					imeDobavljaca : ime,
                    telefon : telefon,
                    email : email,
                    adresa : adresa,
                    idDobavljaca : props.idDobavljaca
				})
			}).then((res) =>{
            
            if(res.status===200){ 
                if(ime !== props.imeDobavljaca){
                    setMesages(`Za dobavljaca ${props.imeDobavljaca} ste promenili ime  u ${ime}`) 
                }
                if(telefon !== props.telefon){
                    setMesages(`Za dobavljaca ${ime} ste promenili telefon u ${telefon}`)
                }
                if(email !== props.email){
                    setMesages(`Za dobavljaca ${ime} ste promenili email u ${email}`)
                }
                if(adresa !== props.adresa){
                    setMesages(`Za dobavljaca ${ime} ste promenili adresu u ${adresa}`)
                }

             }
            if(res.status===401){return  setMesages('Vasa sessija je istekla, konektujte se ponovo ERROR: 401 ')}
            if(res.status===422){return  setMesages('Doslo je do greske sa konekcijom ')}
            if(res.status===10){return  setMesages('Nemate pristup ovom delu aplikacije')}
    
        });
           
            
            
            setTimeout(function(){
                setList(0)
            },3000)
            
    } 
    const Azuriraj =()=>{        
    return(
        <div >
            <div >
            {mesages !== '' ? 
                    <div className="alert alert-success alert-dismissible">
                        <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                        <strong>{mesages} </strong> 
                </div> : null
            }
                <button onClick={()=>setList(0)} 
                        type='button' 
                        className='btn btn-primary'>
                            Back
                </button>
            </div>
            <div className='row'>
                <div className='col-sm-12 text-center'>
                    <h1>{props.imeDobavljaca}</h1>
                </div>
            </div>
            <br /><br />
            <div className='row'>
                <div className='col-sm-4'></div>
                <div className='col-sm-4'>
                    <label>Ime dobavljaca</label>
                    <input id='ime' className='form-control' defaultValue={props.imeDobavljaca} />
                </div>
            </div>
            <br /><br />
            <div className='row'>
                <div className='col-sm-4'></div>
                <div className='col-sm-4'>
                <label>Telefon dobavljaca</label>
                    <input id='telefon' type="tel" className='form-control' defaultValue={props.telefon} />
                </div>
            </div>
            <br /><br />
            <div className='row'>
                <div className='col-sm-4'></div>
                <div className='col-sm-4'>
                <label>Emai dobavljaca</label>
                    <input id='email' className='form-control' defaultValue={props.email} />
                </div>
            </div>
            <br /><br />
            <div className='row'>
                <div className='col-sm-4'></div>
                <div className='col-sm-4'>
                <label>Adresa</label>
                    <input id='adresa' className='form-control' defaultValue={props.adresa} />
                </div>
            </div>
            <br /><br />
            <div className='row'>
                <div className='col-sm-12 text-center'>
                    <button onClick={()=>promeni()} type='button' className='btn btn-primary'>Azuriraj</button>
                </div>
            </div>
           
         
 
        </div>
    )
    }
    return(
        <div>
            {list === 2 ? Azuriraj() : null}
            {list ===0 ? <DobavljaciEdit role={role} props={{token}}/> : null}
        </div>
    )

}

export default AzurirajDobavljaca;