import { useState, useEffect } from "react";
import Kalkulacije from "../components/Kalkulacije";
import AzurirajRabat from "./AzurirajRabat";

const DajKalkulaciju =({props,token,role})=>{
    
    const[stranica, setStranica]=useState(1)
    const [data,setData]=useState([])
    const[zbir, setZbir]=useState(0)
    const[errorMessages, setErrorMessages]=useState('')
    const[items, setItems]=useState()//koristi se za azuriranje rabata
    
    
    

    useEffect(() => {
        const URL =`/dajRecepturuReact/${props.idKolaca}`;
        fetch(URL,{
            method: "GET",
            headers: {
              
              }
        })
            .then((res) =>{
                if(res.status===200){return res.json() }
                if(res.status=== 10){return setErrorMessages('Nemate pristup ovom delu kalkulacije')}
                if(res.status===401){return  setErrorMessages('Vasa sessija je istekla, konektujte se ponovo ERROR: 401 ')}
               if(res.status===422){return  setErrorMessages('Neregularna konakcija, molimo Vas da se ispravno konektujete konektujete  ERROR: 422 ')}
            })
                
            .then((response) => { 
                
                setData(response)
                if(role.rola_1===true || role.user===1){
                 
                const cena=response.map(item => item[4]).reduce((saberi, sab)=>saberi+sab);
                setZbir(cena.toFixed(2)) 
                }else{
                    setErrorMessages('Nemate pristup ovom delu kalkulacijeeeeeeeeeeeee') 
                }   
            })
    }, [])
    
        
            
    
    
 
 
    const promeniRabat=(items)=>{
        
        setItems(items)
        setStranica(2)
        
    }
    const prikaziKalkulaciju = ()=>{
        
    return(
        <div>
            {errorMessages ==='' ?
        <div className="row">
            <div className="col-sm-12 text-center"><h2>{props.imeKolaca}</h2></div>
            <br /><br />
            <div className="col-sm-12">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Ime sirovine</th>
                            <th>kolicina</th>
                            <th>Cena/kg</th>
                            <th>Cena</th>
                            <th>Rabat</th>
                           
                        </tr>
                    </thead>
                
                {data.map((items,i)=>(

                    <tbody key={i}>
                        <tr >
                            <th>{items[0]}</th>
                            <th>{items[2]}</th>
                            <th>{items[3]}</th>
                            <th>{items[4]}</th>
                            <th onClick={()=>{
                                promeniRabat(items)}}>
                                {items[5]}</th>
                            
                    
                            
                            
                        </tr>
                    </tbody>
                    
                ))}
                </table>
                
            </div>
            <div className="row">
                <div className="col-sm-4"></div>
                <div className="col-sm-4"></div>
                <div className="col-sm-4 text-center">
                    
                    <h3>Cena : {zbir}</h3>
                </div>
                
            </div>
            <button className="btn btn-primary" onClick={()=>setStranica(0)}>Back</button>
            
        </div>
             :
             <div className="alert alert-success alert-dismissible">
                <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                    <strong>{errorMessages}</strong>
           </div>
             }
        </div>
    )}
    return(
       
        <div>
            {stranica === 1 ?  prikaziKalkulaciju() : null }
            {stranica === 0 ?  <Kalkulacije role={role} /> : null }
            {stranica ===2 ? <AzurirajRabat props={props}  imeKolaca={props.imeKolaca} role={role} items={items} /> : null}
        </div>
    )
}
export default DajKalkulaciju;