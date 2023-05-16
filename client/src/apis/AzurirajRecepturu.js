import { useState, useEffect  } from "react";
import AzuriajRecKolac from "./AzuriajRecKolac";
import { useNavigate } from 'react-router-dom';
const AzurirajRecepturu = ({role})=>{
    const[errorMesagges,setErrorMesagges]=useState('');
    const[list, setList]=useState(0)
    const[data, setKolac]=useState([]);
    const [filteredData,setFilteredData] = useState(data); //ovo je pocetno stanje kolaca i dobija vrednost iz search
    const [idKolaca, setIdKolaca]=useState(0)
    const[imeKolaca, setImeKolaca]=useState('')
    const navigate = useNavigate();
    
    const URL ='/listaKolacaNaslovReact';
    useEffect(()=>{
        fetch(URL,{
            method: "GET",
            headers: {
                
              }
        })
        .then((res) =>{
            if(res.status===200){ return res.json()}
            if(res.status===401){return  setErrorMesagges('Vasa sessija je istekla, konektujte se ponovo ERROR: 401 ')}
            if(res.status===422){return  setErrorMesagges('Neregularna konakcija, molimo Vas da se ispravno konektujete konektujete  ERROR: 422 ')}
        })     
        .then((response) => { 
            setKolac(response);
            setFilteredData(response);  
        })
        .catch(error=>{
            console.log('ovo je greska ',error)
            setErrorMesagges('Neuspela konekcija sa bazom, proverite internet konekciju')
        })
    },[]);
        
            
        
    const azuriraj =()=>{
    const handleSearch = (event) =>{
        
        let value = event.target.value.toLowerCase();
       
        
        let result = [];
        result = data.filter((data) => {
            
            return data[1].search(value) !== -1;
        });
        setFilteredData(result);
                }
        const promena = (id,ime)=>{
            setIdKolaca(Number(id))
            setImeKolaca(ime)
            setList(1)
        }
      
                
    return(
        <div>
            <div className="row">
                    <div className="col-sm-12">
                    <input className="form-control" onChange={(event) =>handleSearch(event)} id="myInput" type="text" placeholder="Search.."></input>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                    
                    </div>
                </div>

                <table className="table table-hover">
                <thead>
                
                    <tr>
                        <th>Id kolaca</th>
                        <th>Ime kolaca</th>
                    </tr>
                    </thead>
                
                    <tbody>
                { filteredData.map((item, i)=>(
                    <tr key={i}>
                    <td>{item[0]}</td>
                    <td onClick={()=>promena(item[0],item[1])}>{item[1]}</td>
                </tr>
                ))}
                </tbody>
                </table>
                <div className="col-sm-4" >
                     <button type="button" className="btn btn-primary" onClick={()=>navigate(-1)}>Nazad</button>
                </div>
                <br /><br />
            </div>
    )}
    return(
        <div>
            {errorMesagges ==='' ?
                <div>
                { list ===0 ? azuriraj() :null}
                {list === 1 ? <AzuriajRecKolac role={role}  props={{idKolaca,imeKolaca}} /> : null}
             </div>:
             <div className="alert alert-success alert-dismissible">
             <p className="close" data-dismiss="alert" aria-label="close">&times;</p>
                <strong>{errorMesagges}</strong>
            </div>
            }
        </div>
        
    )
}
export default AzurirajRecepturu;