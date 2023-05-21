import { useState } from 'react';
import DobavljaciEdit from "./DobavljaciEdit";


const ObrisiDobavljaca=({role,props})=>{
    const[list,setList]=useState(4)
    const[errorMesagges,setErrorMesagges]=useState('');
    const[messages, setMessages]=useState('')
    const Obrisi=()=>{  
        const Ukloni=()=>{
            fetch('/obrisiDobavljacaReact',{
                method : 'POST',
                headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},body: JSON.stringify({ //moramo poslati u JSON formatu
					idDobavljaca : props.idDobavljaca,
                    imeDobavljaca : props.imeDobavljaca
				})
            }).then((res)=>{
                if(res.status===200){return res.json()}
            }).then((response)=>{
                if(response.error){return setErrorMesagges(response.poruka)
                }else{
                    setMessages(response)
                }
            }).catch((error)=>{console.log(error)})
            setTimeout(function(){
                setList(0) //vraca nas u listu kolaca
            },5000) 
        }
        return(
            <div>
                <div className='row'>
                {messages !=='' ? 
                        <div className="alert alert-success alert-dismissible">
                            <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                            {messages}
                        </div> : null}
                    <div className='col-sm-12'>
                        <ul className="nav nav-tabs actions-nav">
                            <li>
                                <button className="btn btn-default" onClick={()=>setList(0)}>Lista</button>
                            </li>
                            <li className="active">
                                <button className="btn btn-default">Obrisi</button>
                            </li>
                        </ul>
                    </div>
                </div><br />
                <div className='row'>
                    <div className='col-sm-12 text-center'>
                    <h2 style={{color: "red"}}>Obrisi dobavljaca</h2>
                    </div>
                </div><br /><br />
                <div className="row">
                <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                        <label>Ime</label>
                        <input className="form-control" defaultValue={props.imeDobavljaca} disabled />
                    </div>
                </div><br />
                <div className="row">
                <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                        <label>Adresa</label>
                        <input className="form-control" defaultValue={props.adresa} disabled />
                    </div>
                </div>
                <br /><br /><br /><br />
                <div className="col-sm-12 text-center">
                    <button onClick={()=>Ukloni()}  type="button" className="btn btn-danger">Obrisi</button>
                </div>
               
            </div>

        ) }
    return(
        <div>
            {errorMesagges === '' ? <>
            {list ===4 ? Obrisi() : null}
            {list ===0 ? <DobavljaciEdit role={role} props={props} /> : null}
            </>:
                <div className="alert alert-success alert-dismissible">
                <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                    <strong>{errorMesagges}</strong>
           </div>
            }
        </div>
    )

}
export default ObrisiDobavljaca;