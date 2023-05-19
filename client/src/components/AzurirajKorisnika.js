import React,{useState} from "react";
import Administrator from "./Administrator";
const AzurirajKorisnika=({props,azuriraj})=>{
    const [errorMesagges, setErrorMesagges] = useState('')
    const[messages,setMessages]=useState('')
    const[stranica,setStranica]=useState(1)
    const[rola_1,setRola_1]=useState(azuriraj.rola_1)
    const[rola_2,setRola_2]=useState(azuriraj.rola_2)
    const[rola_3,setRola_3]=useState(azuriraj.rola_3)
    const[block, setBlock]=useState(azuriraj.block_user)
    const changeBlock=()=>{
        setBlock(!block)     
            }
   const handleRola_1Change=()=>{
        setRola_1(!rola_1)  
         }
    const handleRola_2Change=()=>{
        setRola_2(!rola_2);
    }
    const handleRola_3Change=()=>{
        setRola_3(!rola_3);
    }
   const save=()=>{
    const opt={
        method : 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + props.token,
            IdKorisnika:  props.user
          },
          body: JSON.stringify({
            'username':azuriraj.user,
            'rola_1':rola_1,
            'rola_2':rola_2,
            'rola_3':rola_3,
            'idKorisnika':azuriraj.id,
            'block_user':block

          })}
    fetch('/adminAzurirajKorisnika',opt)
    .then(resp =>{ 
        if(resp.status===200){ return resp.json()}   
    })
    .then(response=>{
        if(response.error){return setErrorMesagges(response.poruka)
        }else{
            setMessages(response)
        }
    })
    .catch(error=>{
        console.log('Error: ',error)
    })
    setTimeout(function(){
        setStranica(0) 
            },3000)
   }//save
  
   
    const Azuriraj=()=>{
        return(
            <div className="container">
                <br />
                {errorMesagges === '' ? <>
                <div className="row">
                    <div className="col-sm-12 text-center">
                        <h3>User: {azuriraj.user}</h3>
                    </div>
                </div>

                <br /><br />
                {messages !=='' ? 
                        <div className="alert alert-success alert-dismissible">
                            <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                            {messages}
                        </div> : null}
               <div className="row">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th> Id korisnika:</th>
                                    <th>{azuriraj.id}</th>
                                </tr>
                                <tr>
                                    <th> Email:</th>
                                    <th>{azuriraj.email}</th>
                                </tr>
                                <tr>
                                    <th> Telefon:</th>
                                    <th>{azuriraj.telefon}</th>
                                </tr>
                                <tr>
                                    <th> Adresa:</th>
                                    <th>{azuriraj.adresa}</th>
                                </tr>
                                <tr>
                                    <th> Radna pozicija:</th>
                                    <th>{azuriraj.radno_mesto}</th>
                                </tr>
                                <tr>
                                    <th> rola 1:</th>
                                    <th><input type='checkbox' style={{width: '20px',height: '20px'}} onChange={()=>handleRola_1Change()}    defaultChecked={rola_1} /></th>
                                </tr>
                                <tr>
                                    <th> rola 2:</th>
                                    <th><input type='checkbox' style={{width: '20px',height: '20px'}} onChange={()=>handleRola_2Change()}    defaultChecked={rola_2} /></th>
                                </tr>
                                <tr>
                                    <th> rola 3:</th>
                                    <th><input type='checkbox' style={{width: '20px',height: '20px'}} onChange={()=>handleRola_3Change()}    defaultChecked={rola_3} /></th>
                                </tr>
                                <tr>
                                    <th style={{'color':'red'}}>Block user:</th>
                                    <th><input type='checkbox' style={{width: '20px',height: '20px'}} onChange={()=>changeBlock()}    defaultChecked={azuriraj.block_user} /></th>
                                </tr>
                            </thead>
                        </table>
                        
                        
                    </div><br />
                    <div className="col-sm-12 text-center">
                            <button className="btn btn-primary" onClick={()=>save()}>Save</button>
                    </div>
                        <p  className="btn btn-info btn-sm" onClick={()=>setStranica(0)}>
                        <span className="glyphicon glyphicon-arrow-left"></span>Back</p> 
                   
               </div>
               </> : 
                    <div className="alert alert-success alert-dismissible">
                    <p className="close" data-dismiss="alert" aria-label="close">&times;</p>
                    <strong>{errorMesagges}</strong>
                </div>
                }
               </div>        
        )
    }
    return(
        <div>
            {stranica=== 1 ? Azuriraj() : null }
            {stranica ===0 ? <Administrator props={props} /> : null} 
        </div>
    )
}
export default AzurirajKorisnika;