import { useState } from 'react';
import DobavljaciEdit from "./DobavljaciEdit";


const ObrisiDobavljaca=({role,props})=>{
    const[list,setList]=useState(4)
    const[imaSirovina, setImaSirovina]=useState('')
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
                if(response.proveraSirovine){
                   
                    setImaSirovina(response.poruka)
                    
                }else if(response.error){return setErrorMesagges(response.poruka)
                }else{
                    console.log(typeof(response) )
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
                    <h2 style={{color: "red"}}>Obrisi dobavljaca </h2>
                    </div>
                </div><br /><br />
                {imaSirovina !=="" ? <>
                <div className='col-sm-12'>
                
                    <h3>Dobavljac sadrzi sirovine,da bi ste ga obrisali prvo morate obrisati ili azurirati dobavljaca u sledecim sirovinama:</h3> 
                <br /><br />
                </div>
                <div className='row'>
                    <div className='col-sm-4'></div>
                    <div className='col-sm-4'>
                        {imaSirovina.map((item,i)=>(
                        <>   <label  className="form-label">Ime sirovine:</label>
                            <input key={i} className="form-control" defaultValue={item} disabled />
                            <br /> 
                        </>    
                        
                        ))}
                    </div>
                </div><br /><br />
                
                </>: <>
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
                </>}
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