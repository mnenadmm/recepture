import React,{useState} from "react";
import Administrator from "./Administrator";
import ObrisiKorisnika from "./ObrisiKorisnika";
const BezVerifikacije=({props,func})=>{
    const[azuriraj,setAzuriraj]=useState({})
    const[stranica,setStranica]=useState(3)
    const noVerif=()=>{
        const uredi=(id,user,email,telefon,adresa,block)=>{
            setAzuriraj({
                'id':id,
                'user':user,
                'email':email,
                'telefon':telefon,
                'adresa':adresa,
                'block_user':block
            })
            setStranica(4)
    
        }
        return(
            <div className="container"><br />
            {func.errorMesagges !==''?
        <div className="col-sm-12 text-center">
            <h4 style={{color:'red'}}>{func.errorMesagges}</h4>     
        </div>
            : 
            <div>
                <div className="col-sm-12 text-center" >
                        <h3>Korisnici bez verifikacije</h3>
                </div>
                <div className="col-sm-12">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>User</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {func.noVerification.map((item,i)=>(
                                <tr key={i}>
                                    <th>{item[0]}</th>
                                    <th >{item[1]}</th>                                
                                    <th>{item[2]}</th>
                                    <th>
                                        <span 
                                        onClick={()=>{
                                            uredi(item[0],item[1],item[2],item[3],item[4],item[5])
                                            }}  
                                        className="fa fa-pencil glyphicon glyphicon-pencil"></span>
                                     </th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                </div><br />
                <div className="col-sm-12 text-center" >
                    <h3 style={{"color":"red"}}>Blokirani korisnici</h3>
                </div>
                <div className="col-sm-12">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>User</th>
                                <th>Email</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {func.blockUser.map((item,i)=>(
                                <tr key={i}>
                                    <th>{item[0]}</th>
                                    <th >{item[1]}</th>                                
                                    <th>
                                    {item[2]}
                                    </th>
                                    
                                    <th>
                                        <span 
                                        onClick={()=>{
                                            uredi(item[0],item[1],item[2],item[3],item[4],item[5])
                                            }}  
                                        className="fa fa-pencil glyphicon glyphicon-pencil"></span>
                                     </th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                </div>
                <div>
                    <button onClick={()=>setStranica(0)} className="btn btn-primary">Back</button>
                </div>

            </div>
            
            }
   
        </div>
        )
         // 
    }
    return(
        <div>
            {stranica=== 3 ? noVerif() : null}
            {stranica ===0 ? <Administrator props={props} /> : null}
            {stranica ===4 ? <ObrisiKorisnika props={props} azuriraj={azuriraj}  /> : null}
        </div>
    )
}
export default BezVerifikacije;