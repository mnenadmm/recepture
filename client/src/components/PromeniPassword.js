import React, { useState} from 'react';
import Login from './Login';

const PromeniPassword=()=>{
    const[stranica, setStranica]=useState(1)
    const[mail,setEmail]=useState('');
    const[errorMessages,setErrorMessages]=useState('');
    const[messages,setMessages]=useState('');
    const[info,setInfo]=useState('')
    const PromeniPass=()=>{

    
    const promeni=()=>{
        setTimeout(function(){
            setStranica(0)
        },5000)
       //setMessages('')
        const opt={method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                    'email':mail
                    })}
                    fetch('http://localhost:5000/forgotPassword',opt)
                    .then(resp=>{
                        if(resp.status===200){ return resp.json()}
                        if(resp.status===10){return setInfo(`Poslali smo link za ponistavanje lozinke na ${mail}` )}
                    })
                    .then(data=>{
                        if(data){
                            setMessages(data);
                            setErrorMessages('')
                            setInfo(`Poslali smo link za ponistavanje lozinke na ${mail}` )
                        }
                       
                        
                    })
                    .catch(error=>{
                        console.log('ovo je greska ',error )
                    })
                    
                    
    }
   return(
    <div className="container">
            <div className='col-sm-12 text-center'>
                <h1>Forgot password</h1>
                <br />
                <p style={{color: 'red'}}>{errorMessages}</p>
                
                {info !==''?
            <div className="alert alert-success alert-dismissible">
            <p  className="close" data-dismiss="alert"  aria-label="close">&times;</p>
            <strong>{info}</strong>
            </div>
           :null}
            <br />
            </div>
            <br /><br />
        <div className='row'>
            <div className='col-sm-4'></div>
                <div className='col-sm-4'>
                    <label>
                        <p>Email address</p>
                        <input className="form-control" type="text" onChange={e=>setEmail(e.target.value)} />
                        <p style={{color: 'green'}}>{messages}</p>
                    </label>
            </div>
        </div>
        {mail !==''? 
        <div className='row'>
            <div className='col-sm-4'></div>
            <div className='col-sm-4 text-center'><br />
            <button className='btn btn-primary' onClick={()=>promeni()}>Submit</button>
            </div>
        </div>
        : null}
       
    </div>
   )
    }

    return(
        <div>
            {stranica ===1 ? PromeniPass() : null }
            {stranica ===0 ? <Login /> : null}
        </div>
    )
}

export default PromeniPassword;