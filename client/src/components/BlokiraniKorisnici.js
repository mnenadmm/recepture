import React,{useState} from "react";
import Administrator from "./Administrator";
import ObrisiKorisnika from "./ObrisiKorisnika";
const BlokiraniKorisnici=({props,azuriraj})=>{
    const[stranica,setStranica]=useState(4)
    const[messages, setMessages]=useState('')
    const[block, setBlock]=useState(azuriraj.block_user)
    

    const save=()=>{
        const opt={
            method : 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + props.token,
                IdKorisnika:  props.user
              },
              body: JSON.stringify({
                'username':azuriraj.email,
                'idKorisnika':azuriraj.id,
                'block_user':block
                
    
              })}
        fetch(`/adminBlokirajKorisnika`,opt)
        .then(res=>{
            if(res.status===200){ return res.json()}
        })
        .then(response=>{
            
            setMessages(response)
        })
        setTimeout(function(){
            setStranica(0) 
                },3000)
    }
    
    const Block=()=>{
        const changeBlock=()=>{
                setBlock(!block)       
        }
        return(
            <div className="container">
                <br />
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
                                    <th>Block user</th>
                                    <th><input type='checkbox' style={{width: '20px',height: '20px'}} onChange={()=>changeBlock()}     defaultChecked={azuriraj.block_user} /></th>
                                </tr>
                                <tr>
                                    <th style={{'color':'red'}}>Obrisi usera</th>
                                    <th><input  type="checkbox" style={{width: '20px',height: '20px'}}  onClick={()=>setStranica(5)}/></th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="col-sm-12 text-center">
                            <button className="btn btn-primary" onClick={()=>save()}>Save</button>
                    </div>

                </div>
                <button className="btn btn-primary" onClick={()=>setStranica(0)}>Back</button>
                

                
            </div>
        )
    }

    return(
        <div>
            {stranica ===4 ? Block() : null}
            {stranica ===0 ? <Administrator props={props} /> : null}
            {stranica ===5 ? <ObrisiKorisnika props={props} azuriraj={azuriraj} />  : null}
        </div>
    )
}
export default BlokiraniKorisnici;