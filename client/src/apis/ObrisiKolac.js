import KreirajKolac from "./KreirajKolac"
import { useState } from "react"
const ObrisiKolac=({props,token,role})=>{
    const[list, setList]=useState(0)
    const[poruka, setPoruka]=useState(0)
    const[mesages, setMesages]=useState('')
    const[errorMesssages,setErrorMessages]=useState('')
    const ukloniKolac=()=>{
        
        fetch('/obrisiKolacReact', {
            method: 'POST',
				headers: {
                    
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ //moramo poslati u JSON formatu
					idKolaca : props.idKolaca
				})
			}).then((res) =>{
            
            if(res.status===200){return setMesages(`Obrisali ste kolac ${props.imeKolaca}`)}
               if(res.status===401){return  setErrorMessages('Vasa sessija je istekla, konektujte se ponovo ERROR: 401 ')}
               if(res.status===422){return  setErrorMessages('Neregularna konakcija, molimo Vas da se ispravno konektujete konektujete  ERROR: 422 ')}
               if(res.status===10){return setErrorMessages("Nemate pristup ovom delu aplikacije")}
            }).catch(error=>{
                console.log('ovo je greska ',error)
                setErrorMessages('Neuspela konekcija sa bazom, proverite internet konekciju')
            })
            
            setPoruka(1)
            setTimeout(function(){
                setList(1) //vraca nas u listu kolaca
            },3000)
            
    }
    const obrisi =()=>{
        return(
            <div>
                {errorMesssages ==='' ? 
            <div className="row">
                {poruka ===1 ? 
                        <div className="alert alert-success alert-dismissible">
                            <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                            {mesages}
                        </div> : null}
                <div className="col-sm-12 text-center">
                    <h2>Obrisi kolac</h2>
                </div>
                <div className="row">
                <ul className="nav nav-tabs actions-nav">
                    <li>
                        <button className="btn btn-default" onClick={()=>setList(1)}>Lista</button>
                    </li>
                    <li className="active">
                        <button className="btn btn-default">Obrisi kolac</button>
                    </li>
                </ul>
                </div>
                <div className="row">
                    <br /><br />
                    <div className="col-sm-12 text-center">
                        <h2>{props.imeKolaca}</h2>
                    </div>
                </div>
                <div>
                <br /><br /><br /><br />
                    <h2>
                    <strong style={{color: "red"}}>Da li ste siguni da zelite da obrisete kolac {props.imeKolaca}??</strong>
                        </h2>
                </div>
                <br /><br /><br /><br />
                <div className="col-sm-12 text-center">
                    <button onClick={()=>ukloniKolac()} type="button" className="btn btn-danger">Obrisi</button>
                </div>
            </div>
                  :
                  <div className="alert alert-success alert-dismissible">
                    <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                    <strong>{errorMesssages}</strong>

                  </div>  }
            </div>
        )
    }
   return(
    <div>
        {list ===0 ? obrisi() : <KreirajKolac role={role} props={{token}} />}
    </div>
   )
    
}

export default ObrisiKolac;