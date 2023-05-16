import React,{useState, useEffect} from "react";
import { useSearchParams } from "react-router-dom";//moze da pokupi parametre sa url linka
import Login from "./Login";
const ChangePassword=()=>{
    const[stranica,setStranica]=useState(0)
    const[data,getData]=useState('')
    const[search, setSearch]=useSearchParams();
    console.log(setSearch)
    const[errorMessages, setErrorMessages]=useState('')
    const[password, setPassword]=useState('')
    const[confirm, setConfirm]=useState('')
    const[errorPassword, setErrorPassword]=useState('')
    const[errorConfirm,setErrorConfirm]=useState('')
    const token=search.get('token')
    const[messages, setMessages]=useState('')
    useEffect(()=>{ 
        fetch(`http://localhost:5000/ChangePasswordK/${token}`)
        .then(res=>{
            if(res.status===200){return res.json()}
           if(res.status!==200){return setErrorMessages('Token je istekao')} 
        })
        .then(response=>{
            getData(response)
            console.log(response)
        })
        .catch(error=>{
            console.log('ovo je',error)
        })   
    },[token])
    const NewPassword=()=>{
        const promeni=(e)=>{
            e.preventDefault();
            if(password===''){
                setErrorPassword('Ovo polje je obavezno')
            }else{
                setErrorPassword('')
            }
            if(confirm===''){
                setConfirm('Ovo polje je obavezno')
            }else{
                setConfirm('')
            }
            if(password===confirm && password !==''  && confirm!==''){
                setErrorConfirm('')
                const opt={method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  'password':password
                })};
                console.log(password)
                fetch(`http://localhost:5000/noviPassword/${token}`,opt)
                .then(res=>{
                    if(res.status===200){return res.json()}
                    if(res.status===401){return setErrorMessages('Token je istekao')}
                })
                .then(response=>{   
                    setMessages(response)
                })
                .catch(error=>{
                    console.log(error)
                })
            }else{
                setErrorConfirm('Lozinke se ne podudaraju')
            }
            setTimeout(function(){
                setStranica(1)
            },5000)
        }
    return(
       <div>
        {errorMessages!==''?
            <div className="container">
                <div className='col-sm-12 text-center'>
             <br />
                <h3 style={{color: 'red'}}>{errorMessages}</h3>
                <br />
                </div>
            </div>
        :
        <div className="container">
            <div className='col-sm-12 text-center'>
             
                <h3>Promeni password</h3>
                
                <br />
                {messages !==''?
            <div className="alert alert-success alert-dismissible">
            <p  className="close" data-dismiss="alert"  aria-label="close">&times;</p>
            <strong>{messages}</strong>
            </div>
           :null}  
            </div>
           
            <form onSubmit={(e)=>promeni(e)}>
            <div className='row'>
                    <div className='col-sm-4'></div>
                    <div className='col-sm-4'>
                        <label>
                            <p>Email:</p>
                            <input defaultValue={data} className='form-control' type="text" disabled  />
                        </label>
                    </div>
            </div>
                <div className='row'>
                    <div className='col-sm-4'></div>
                    <div className='col-sm-4'>
                        <label>
                            <p>New Password</p>
                            <input onChange={e => setPassword(e.target.value)} className='form-control' type="password"  />
                            <p style={{color: 'red'}}>{errorPassword}</p>
                        </label>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-sm-4'></div>
                    <div className='col-sm-4'>
                        <label>
                            <p>Confirm password</p>
                            <input onChange={e => setConfirm(e.target.value)} className='form-control' type="password"  />
                            <p style={{color: 'red'}}>{errorConfirm}</p>
                        </label>
                    </div>
                </div>
                <br /><br />
                <div className='col-sm-12 text-center'>
                    <button onClick={(e)=>promeni(e)} className='btn btn-primary' type="submit">Submit</button>
                </div>

            </form>

        </div>
        }
       </div>
    )
    }
    return(
        <div>
            {stranica===0 ? NewPassword() : null}
            {stranica ===1 ? <Login /> :null}
        </div>
    )
}
export default ChangePassword;