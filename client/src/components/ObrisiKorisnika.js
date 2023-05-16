import React, { useState } from "react";
import Administrator from "./Administrator";
const ObrisiKorisnika=({props,azuriraj})=>{
    const[stranica,setStranica]=useState(5)
    const[messages,setMessages]=useState('')
    const[messagesOdbl,setMessagesOdbl]=useState('')
    const Obrisi=()=>{
       const odblokirajKorisnika=()=>{
        const opt={
            method : 'POST',
            headers: {
                'Content-Type': 'application/json'},
              body: JSON.stringify({
                'idKorisnika':azuriraj.id,
                'username':azuriraj.user })};
                fetch(`/adminVratiKorisnika`,opt)
                .then(res=>{
                    if(res.status===200){return res.json()}
                })
                .then(data=>{
                    
                    setMessagesOdbl(data)
                })
                .catch(error=>{console.log(error)})
                setTimeout(function(){
                    setStranica(0) 
                        },3000)
            

       };
        const ukloniKorisnika=()=>{
           
            const opt={
                method : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    
                  },
                  body: JSON.stringify({
                    'idKorisnika':azuriraj.id,
                    'username':azuriraj.user
                  })}
            fetch(`/obrisiKorisnikaAdmin`,opt)
            .then(res=>{
                if(res.status===200){return res.json()}
            })
            .then(data=>{
                
                setMessages(data)
            })
            .catch(error=>{console.log(error)})
            setTimeout(function(){
                setStranica(0) 
                    },3000)
        }
        return(
            <div className="container">
                <div className="row">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4 text-center">
                        <h2 style={{'color':'red'}}>Uredi Korisnika</h2>
                    </div>
                </div><br /><br />
                {messages  !=='' ? 
                        <div className="alert alert-success alert-dismissible">
                            <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                            {messages}
                        </div> : null}
                        {messagesOdbl  !=='' ? 
                        <div className="alert alert-success alert-dismissible">
                            <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                            {messagesOdbl}
                        </div> : null}
                <div className="row">
                    <div className="col-sm-12">
                        <h3>Da li ste sigurni da zelite da obrisete korisnika <strong>{azuriraj.user}??</strong></h3>
                    </div>
                </div><br />
                <div className="row">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>{azuriraj.id}</th>
                                </tr>
                                <tr>
                                    <th>User</th>
                                    <th>{azuriraj.user}</th>
                                </tr>
                                <tr>
                                    <th>Email:</th>
                                    <th>{azuriraj.email}</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 text-center">
                        <button onClick={()=>odblokirajKorisnika()}  className="btn btn-primary">Odblokiraj</button>
                    </div>
                    <div className="col-sm-4"></div>
                </div>
                <div className="row">
                    <div className="col-sm-4">
                        <button className="btn btn-primary" onClick={()=>setStranica(0)}>Back</button>
                    </div>
                    <br /><br />
                    <div className="col-sm-12 text-center">
                        <button onClick={()=>ukloniKorisnika()} className="btn btn-danger">Obrisi korisnika</button>
                    </div>
                    <div className="col-sm-4"></div>
                </div>
                
                
                
            </div>
        )
    }

    return(
        <div>
            {stranica ===5 ? Obrisi() : null}
            {stranica === 0 ? <Administrator props={props} /> : null}

        </div>
    )
}
export default ObrisiKorisnika;