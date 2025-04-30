import React,{useState} from "react";
import Administrator from "./Administrator";
import AzurirajKorisnika from "./AzurirajKorisnika";
const AdminKorisnici=({props,func})=>{
    const[stranica, setStranica]=useState(2)
    const[azuriraj,setAzuriraj]=useState({})
    const Korisnici=()=>{
        const uredi=(id,user,rola_1,rola_2,rola_3,block_user,email,adresa,telefon)=>{
          
            setAzuriraj({
                'id': id,
                'user':user,
                'rola_1':rola_1,
                'rola_2':rola_2,
                "rola_3":rola_3,
                'email' : email,
                'adresa':adresa,
                'telefon':telefon,
                'block_user' : block_user
                });
           setStranica(1)
        }

        return(
            <div>
                <div className="container">
        {func.errorMesagges !==''?
        <div className="col-sm-12 text-center">
            <h4 style={{color:'red'}}>{func.errorMesagges}</h4>     
        </div>
            :
        <div>
                <div className="col-sm-12 text-center" >
                    <h3>Lista korisnika</h3>
                </div>
                <div className="col-sm-12">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>User</th>
                                <th>1 rola</th>
                                <th>2 rola</th>
                                <th>3 rola</th>
                            </tr>
                        </thead>
                        <tbody>
                            {func.data.map((item,i)=>(
                                <tr key={i}>
                                    <th>{item[0]}</th>
                                    <th >{item[1]}</th>                                
                                    <th>
                                        <input style={{width: '20px',height: '20px'}}  type='checkbox'defaultChecked={item[5]} disabled /> 
                                    </th>
                                    <th>
                                        <input style={{width: '20px',height: '20px'}}   type='checkbox' defaultChecked={item[6]} disabled />
                                    </th>
                                    <th>                                  
                                        <input style={{width: '20px',height: '20px'}} type='checkbox' defaultChecked={item[7]} disabled />                                       
                                    </th>
                                    <th>
                                        <span 
                                        onClick={()=>{
                                            uredi(item[0],item[1],item[5],
                                                item[6],item[7],item[8],item[2],item[4],item[3])}}  
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
            </div>
            
        )
    }
    return(
        <div>
            {stranica===2 ? Korisnici() : null}
            {stranica ===0 ? <Administrator props={props}  /> : null}
            {stranica ===1 ? <AzurirajKorisnika  props={props} azuriraj={azuriraj} /> :null}
        </div>
    )
}
export default AdminKorisnici;