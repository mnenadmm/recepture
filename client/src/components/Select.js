import React, {useState, useEffect } from "react";
const Select = ({options,ime, promena,setErrorMesagges})=>{
    const [state, setState]=useState([]);
   
    useEffect(()=>{
        fetch(options,{
            method: "GET"
        })
        .then((res) =>{
           if(res.status===200){return res.json()} 
           
        })
            
        .then((response) => {
            if(response.error){
                setErrorMesagges(response.poruka)
              
            }else{ 
                setState(response);
            }
              
        })
        .catch(error=>{
            setErrorMesagges('Neuspela konekcija sa bazom, proverite internet konekciju')
            console.log('ovo je greska ',error)
            
        })
    },[]);
    
        return(
            
            <div>
                {setErrorMesagges !=='' ? 
                <select 
                    className="form-control" 
                    onChange={(e)=>{promena(e.target.value)}}   
                >
                    <option defaultValue={ime}>{ime}</option>
                    {state.map((stat) => (
              <option  
                    key={stat[0]} 
                    value={stat[0]} 
                    >{stat[1]}
            </option>
            ))}
                </select>  
                : 
               
                <div className="alert alert-success alert-dismissible">
                <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                   <strong>Nemate pristup ovom delu aplikacije select</strong>
               </div>
               
                }
                
            </div>

            
        )}


export default Select;