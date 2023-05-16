import React,{useState, useEffect} from "react";
import { useSearchParams } from "react-router-dom";//moze da pokupi parametre sa url linka

const VerifikujNalog=()=>{
    const[data,getData]=useState('')
    let [search, setSearch] = useSearchParams();
    console.log(setSearch)
    const token=search.get('token')
    console.log(token)
    const[errorMessages, setErrorMessages]=useState('')
    const[newToken, setNewToken]=useState('')
    const[proveraTokena, setProveraTokena]=useState(null)
    
    const sendNewToken=()=>{
        fetch(`http://localhost:5000/posaljiDrugiToken/${token}`)
        .then(res=>{
            if(res.status===200){return res.json()}
        }).then(response=>{
            console.log(response)
            setNewToken(response)
            setProveraTokena(response)
            
            
            
        }).catch(error=>{console.log('ovo je ', error)})
    }
    useEffect(()=>{
        fetch(`http://localhost:5000/verifikujNalog/${token}`)
        .then(res=>{
            if(res.status===200){return res.json()}
            if(res.status===500){return setErrorMessages('Vas verifikacioni token je istekao ')}
          

        })
        .then(response=>{
        
            getData(response)
            
        })
        .catch(error=>{
            console.log('ovo je',error)
        })
    },[token])
    console.log(proveraTokena)
    const verifikuj=()=>{
        
        return(
            <div>
                {errorMessages ==='' ? 
                    <div>
                        <h2>Verifikacija: {data}</h2>
                    </div>    
                :
                    <div><br />
                        <div className="row">
                            <div className="col-sm-12 text-center">
                                <h2 style={{'color':'red'}}>{errorMessages}</h2>
                            </div>
                        </div><br /><br />
                         
                        <div className="row">
                            <div className="col-sm-12 text-center">
                                <button onClick={()=>sendNewToken()} className="btn btn-info">Posalji novi token</button>
                            </div>
                        </div><br /><br />
                        <div className="row">
                            <div className="col-sm-12 text-center">
                                <h2 style={{'color':'green'}}>{newToken}</h2>
                            </div>
                        </div>
                        
                        
                    </div>  
                }
               
            </div>
        )
    }

    return(
        <div>
            {verifikuj()}
        </div>
    )
}

export default VerifikujNalog;