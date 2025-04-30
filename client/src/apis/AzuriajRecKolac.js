import { useState, useEffect  } from "react";
import UkloniSirovinuReceptura from "./UkloniSirovinuReceptura";
import UrediRecepturu from "./UrediRecepturu";
import { useNavigate } from 'react-router-dom';
import DodajSirovinuURecepturu from "./DodajSirovinuURecepturu";
const AzuriajRecKolac=({props,token,role})=>{
    const[stranica, setStranica]=useState(0)
    const[data, setData]=useState([])
    const [filteredData,setFilteredData] = useState(data); //ovo je pocetno stanje kolaca i dobija vrednost iz search
    const[idSirovine, setIdSirovine]=useState(0)
    const[imeSirovine, setImeSirovine]= useState('')
    const[kolicina, setKolicina]=useState(0)
    const[errorMessages,setErrorMessages]=useState('');
    const navigate = useNavigate();
    const imeKolaca=props.imeKolaca;
    const idKolaca=props.idKolaca;
    
    useEffect(()=>{
        const proba =()=>{
        fetch(`/dajRecepturuReact/${props.idKolaca}`,{
            method: "GET",
            headers: {
                
              }
        })
        .then((res) =>{
            if(res.status===200){return res.json()}
        })
        .then((response) => { 
            if(response.error){return setErrorMessages(response.poruka)
            }else{
                setData(response[2]);  
                setFilteredData(response[2]);
            }
            
           
        }).catch((error)=>{
            console.log('ERROR: ',error)
        })
    }
    proba()
    },[props.idKolaca,setData,setFilteredData]);
   
   
        
    
    const Azuriranje =()=>{
        const obrisi = (id,ime,kolicina)=>{
            
            setKolicina(kolicina)
            setIdSirovine(id)
            setImeSirovine(ime)
            setStranica(2)
        }
        const uredi=(id,ime,kolicina)=>{
            
            setIdSirovine(id)
            setKolicina(kolicina)
            setImeSirovine(ime)
            
            setStranica(1)
        }
    return(
        <div>
            {errorMessages ==='' ? 
        <div >        
                <div>
        	    <ul className="nav nav-tabs actions-nav">
        		<li className="active"  >
                    <button onClick={()=>navigate(-1)} className="btn btn-default">List</button>
                </li>
                <li>
                    <button className="btn btn-default"  onClick={()=>setStranica(3)}>Dodaj sirovinu</button>
                </li>
                <li>
                
                <input className="form-control"  id="myInput" type="text" placeholder="Search.."></input>
                </li>
                 </ul> 
                 <br />
             <div className="row">
                <div className="col-sm-12 text-center">
                    <h2>{props.imeKolaca}</h2>
                    
                    </div>
                </div>  
                <br />  
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Edit</th>
                    <th>Obrisi</th>
                   
                    <th>Ime Sirovine</th>
                    <th>Kolicina</th>
                    
                    
                </tr>
                </thead>
                {filteredData.map((item, i) => (
                <tbody key={i}>
                  <tr>
                    <td> 
                        <span onClick={()=>uredi(item[1],item[0],item[2])}  className="fa fa-pencil glyphicon glyphicon-pencil"></span>
                    </td>
                    <td>
                        <span onClick={()=>obrisi(item[1],item[0],item[2])}  className="fa fa-trash glyphicon glyphicon-trash"></span>
                    </td>
                    <td style={{display:'none'}}>{item[2]}</td>
                    <td>{item[0]}</td>
                    <td>{item[2]}</td>
                  </tr>
                </tbody>  
            ))}
            </table>
            
            </div>
            <div className="col-sm-4" > 
                <button type="button" className="btn btn-primary" onClick={()=>navigate(-1)}>Back</button>
            </div><br /><br />
            </div>
         :
         <div className="alert alert-success alert-dismissible">
                <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                    <strong>{errorMessages}</strong>
         </div>   }
            </div>
    )}
    return(
        <div>
            {stranica  === 0 ? Azuriranje() :null}
            {stranica ===1 ?<UrediRecepturu role={role} token={token} props={{imeKolaca,imeSirovine,kolicina,idKolaca,idSirovine}} /> : null}
            {stranica === 2 ? <UkloniSirovinuReceptura role={role} token={token} props={{imeKolaca, imeSirovine,kolicina, idKolaca,idSirovine}} /> :null} 
            {stranica === 3 ? <DodajSirovinuURecepturu role={role} token={token} props={{idKolaca,imeKolaca}} /> : null}
        </div>
    )
}
export default AzuriajRecKolac;