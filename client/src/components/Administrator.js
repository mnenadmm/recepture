import React,{useState,  useEffect} from "react";
import AdminKorisnici from "./AdminKorisnici";
import AzurirajKorisnika from "./AzurirajKorisnika";
import BezVerifikacije from "./BezVerifikacije";
import BlokiraniKorisnici from "./BlokiraniKorisnici";


const Administrator = ({props,role})=>{
    
    const[stranica,setStranica]=useState(0)
    const [errorMesagges, setErrorMesagges]=useState('')
    //const[azuriraj,setAzuriraj]=useState({})
   
    const[data,getData]=useState([])
    
    const[blockUser, setBlockUser]=useState([])
    const[noVerification, setNoVerification]=useState([])
    useEffect(() => {
        fetch('/administrator',{
            method: "GET",
            headers: {
               
            }
        })
            .then((res) =>{
                    if(res.status===200){ return res.json()}
                    if(res.status===401){ return setErrorMesagges('nemate pristup ovoj stranici') }
            })   
            .then((response) => {  
                getData(response[0]); 
                setBlockUser(response[1]) 
                setNoVerification(response[2])  
            })
            .catch(error=>{
                console.log('ERROR: ',error)
               // setErrorMesagges('Neuspela konekcija sa bazom, proverite internet konekciju')
            })
    }, [])
    const PocetnaAdmin=()=>{
        return(
            <div className="container"> 
                <div className="row">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                        <button onClick={()=>setStranica(2)} className='btn btn-default btn-lg  btn-block'>
                            Korisnici
                        </button>
                    </div>
                </div><br />
                <div className="row">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                        <button onClick={()=>setStranica(3)} className='btn btn-default btn-lg  btn-block'>
                            Korisnici bez verifikacije
                        </button>
                    </div>
                </div><br />
            </div>
        )
    }
    
    return(
        <div>
           
            {stranica===0? PocetnaAdmin() : null }
            {stranica===2? <AdminKorisnici func={{data,errorMesagges}}  props={props}  /> : null }
            {stranica ===1 ? <AzurirajKorisnika props={props} azuriraj={role}  /> : null }
            {stranica ===3 ? <BezVerifikacije func={{blockUser,errorMesagges,noVerification}} props={props} />: null}
            {stranica ===4 ? <BlokiraniKorisnici props={props}  /> : null}
            
            
           
           
            
        </div>
    )
}
export default Administrator;