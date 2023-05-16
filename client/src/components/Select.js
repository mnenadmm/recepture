import React, {useState, useEffect } from "react";
const Select = ({options,ime, promena,setErrorMesagges})=>{
    const [state, setState]=useState([]);
   
    useEffect(()=>{
        fetch(options,{
            method: "GET"
        })
        .then((res) =>{
           if(res.status===200){return res.json()} 
           if(res.status===401){return  setErrorMesagges('Vasa sessija je istekla, konektujte se ponovo ERROR: 401 ')}
            if(res.status===10){return setErrorMesagges('nemate pristup ovom delu aplikacije')}
        })
            
        .then((response) => {
           
            setState(response);  
        })
        .catch(error=>{
            setErrorMesagges('Neuspela konekcija sa bazom, proverite internet konekciju')
            console.log('ovo je greska ',error)
            
        })
    },[options,setErrorMesagges]);
    
        return(
            
            <div>
                
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
                
            </div>

            
        )}


export default Select;