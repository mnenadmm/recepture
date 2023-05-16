import React,{useState} from "react";
import DajKalkulaciju from "./DajKalkulaciju";
const AzurirajRabat=({props,token,role,items})=>{
    const[stranica, setStranica]=useState(2)
    const[rabat, setRabat]=useState(items[5])
    const[messages, setMessages]=useState('')
    const promeni=(event)=>{
        event.preventDefault();
        const urlPromeniRabat=`/azurirajRabat`;
        const optRabat={method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify({
          'imeKolaca':props.imeKolaca,
          'imeSirovine':items[0],
          'idSirovine':items[1],
          'idKolaca':props.idKolaca,
          'rabat':rabat
          
        })};
        fetch(urlPromeniRabat,optRabat)
        .then(res=>{
            if(res.status ===200){return res.json()}
            if(res.status !==200){return setMessages('Doslo je do greske, proverite internet konekciju')}
            })
        .then(response=>{
            
            setMessages(response)
            })
        .catch(error=>{console.log(error)})
   setTimeout(function(){
        setStranica(1)
   },5000)


    }
    const Rabat=()=>{
      
        
        return(
            <div className="container">
                <form onSubmit={(e)=>promeni(e)}>
                <div className="row">
                    <div className="col-sm-12 text-center">
                        <h2>Azuriraj rabat</h2>
                    </div>   
                </div><br />
                {messages !=='' ? 
                <div className="alert alert-success alert-dismissible">
                            <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                            {messages}
                        </div> : null }
            
                <div className="row">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4 text-center">
                        <label>
                            Ime kolaca: 
                            <input className="form-control" defaultValue={props.imeKolaca} disabled />
                        </label>
                        
                    </div>   
                </div><br />
                <div className="row">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4 text-center">
                        <label>
                            Ime sirovine:
                            <input className="form-control" defaultValue={items[0]} disabled />
                        </label>
                    </div>
                </div><br />
                <div className="row">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4 text-center">
                        <label>
                            Cena za KG:
                            <input className="form-control" defaultValue={items[3]} disabled />
                        </label>
                    </div>
                </div><br />
                
                <div className="row">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4 text-center">
                        <label>
                            Rabat:
                            <input className="form-control"  onChange={(e)=>setRabat(e.target.value)} type='number' defaultValue={rabat}  />
                        </label>
                    </div>
                </div>
                
                <div className="row"><br /><br />
                <div className="col-sm-4">
                <button className="btn btn-default" type="button" onClick={()=>setStranica(1)}>Back</button>
                </div>
                    <div className="col-sm-4 text-center">
                        <button className='btn btn-primary' onClick={(e)=>promeni(e)}type="submit">Submit</button>
                    </div>
                </div>
                </form>
                


               
                
                </div>
        )
                };
    return(
        <div>
            {stranica === 2 ? Rabat(): null}
            {stranica === 1 ? <DajKalkulaciju role={role} props={props} /> : null}
        </div>
    )
}

export default AzurirajRabat;