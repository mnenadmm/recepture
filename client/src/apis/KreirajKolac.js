import { useState, useEffect } from "react"
import NapraviKolac from "./NapraviKolac";
import AzurirajKolac from "./AzurirajKolac";
import ObrisiKolac from "./ObrisiKolac";
const KreirajKolac= ({role})=>{
    const[errorMesagges,setErrorMesagges]=useState('');
    const[list, setList]=useState(0);
    const[data, setKolac]=useState([]);
    const [filteredData,setFilteredData] = useState(data); //ovo je pocetno stanje kolaca i dobija vrednost iz search
    const[imeKolaca,setImeKolaca]=useState('');
    const[idKolaca,setIdKolaca]=useState(0);
    const[objasnjenje, setObjasnjenje]=useState('')
    
    const URL ='/dajlistuKolacaReact';
    useEffect(()=>{
        fetch(URL,{
            method: "GET",
            headers: {  
            }
        })
        .then((res) =>{
            if(res.status===200){ return res.json()}
        })
        .then((response) => { 
            if(response.error){setErrorMesagges(response.poruka)
            }else{
                setKolac(response);
                setFilteredData(response);
            }
        })
        .catch(error=>{
            console.log('ovo je greska ',error)
            setErrorMesagges('Neuspela konekcija sa bazom, proverite internet konekciju')
        })
    },[]);
       
            
        
const obrisi = (id,ime)=>{
  const imeKolaca =ime;
   const idKolaca= id;
   setIdKolaca(idKolaca)
   setImeKolaca(imeKolaca)
   setList(3)
   
   

}
const uredi=(id,ime,postupak)=>{
    const imeKolaca= ime;
    const objasnjenje=postupak;
    const idKolaca=id;
     setIdKolaca(idKolaca)
     setImeKolaca(imeKolaca)
     setObjasnjenje(objasnjenje)
     setList(2)
     
}
 const listaKolaca =()=>{
    const handleSearch = (event) =>{
        let value = event.target.value.toLowerCase();
        let result = [];
        result = data.filter((data) => {
            
            return data[1].search(value) !== -1;
        });
        setFilteredData(result);
    }
    return(
        <div>
            <div className="col-sm-12 text-center">
                <h2>Lista kolaca</h2>
                <br />
            </div>
            
            <div>
            <ul className="nav nav-tabs actions-nav">
        		<li className="active"  >
                    <button className="btn btn-default">Lista</button>
                </li>
                <li>
                    <button className="btn btn-default" onClick={()=>setList(1)}>Kreiraj kolac</button>
                </li>
                <li><input className="form-control" onChange={(event) =>handleSearch(event)} id="myInput" type="text" placeholder="Search.."></input></li>
                
	
                 </ul>
            <table className="table table-hover">
                <tbody>
                    <tr>
                        <th className="col-sm-1">Azuriraj</th>
                        <th>Obrisi</th>
                        <th>Ime kolaca</th>
                        
                        
                    </tr>
                    {filteredData.map((item, i) => (
                        <tr key={i}>
                            <td> 
                                <span onClick={()=>uredi(item[0],item[1],item[2])} className="fa fa-pencil glyphicon glyphicon-pencil"></span>
                            </td>
                            <td>
                                <span onClick={()=>obrisi(item[0],item[1])}  className="fa fa-trash glyphicon glyphicon-trash"></span>
                            </td>
                            <td>{item[1]}</td>
                            <td style={{display:'none'}}>{item[2]}</td>
                            <td style={{display:'none'}}>{item[0]}</td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    )
}
 return(
    <div>
        { errorMesagges === '' ? 
            <div>
                {list===0 ? listaKolaca() : null  }
                {list===1 ? <NapraviKolac role={role}  /> : null }
                {list===2 ? <AzurirajKolac role={role} props={{idKolaca,imeKolaca,objasnjenje}} /> : null }
                {list ===3 ? <ObrisiKolac role={role} props={{idKolaca, imeKolaca}} /> : null}
            </div>:
            <div className="alert alert-success alert-dismissible">
                <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                    <strong>{errorMesagges}</strong>
           </div>
        }
    </div>
    
 )
}
export default KreirajKolac;