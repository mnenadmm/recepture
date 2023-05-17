import React ,{useState,  useEffect}from "react";
import AzurirajSirovinu from "./AzurirajSirovinu";
import ObrisiSirovinu from "../apis/ObrisiSirovinu";
const SirovineEdit = ({props,role})=>{
    const[errorMesagges,setErrorMesagges]=useState('');
    const [data, getData] = useState([])
    const [filteredData,setFilteredData] = useState(data); //koristi se za search
    const[stranica, setStranica]=useState(0)//koristimo zakretanje po stranicama
    const[idSirovine,setIdSirovine]=useState(0)
    const[imeSirovine, setImeSirovine]=useState('')
    const[cenaSirovine, setCenaSirovine]=useState(0)
    const[idDobavljaca, setIdDobavljaca]=useState(0)
    const[imeDobavljaca, setImeDobavljaca]=useState("")
    
   
    useEffect(() => {
        fetch('/izlistaj/sirovine/react',{
            method: "GET",
            headers: {  
            }
        })
            .then((res) =>{
            if(res.status===200){ return res.json()}
            })  
            .then((response) => { 
                if(response.error){return setErrorMesagges(response.poruka)}
                else{
                    getData(response);
                setFilteredData(response);
                }
               
            })
            .catch(error=>{
                console.log('ovo je greska ',error)
                setErrorMesagges('Neuspela konekcija sa bazom, proverite internet konekciju')
            })
    }, [])
    const uredi = (idSirovine,nazivSirovine,imeDobavljac,cena,idDobavljaca)=>{  
        setIdSirovine(idSirovine);
        setImeSirovine(nazivSirovine);
        setImeDobavljaca(imeDobavljac);
        setCenaSirovine(cena);
        setIdDobavljaca(idDobavljaca);
        
        setStranica(1)
    }
    const obrisi=(idSirovine,nazivSirovine,imeDobavljac,cena,idDobavljaca)=>{
        
        setIdSirovine(idSirovine);
        setImeSirovine(nazivSirovine);
        setImeDobavljaca(imeDobavljac);
        setCenaSirovine(cena);
        setIdDobavljaca(idDobavljaca);
        setStranica(2)//prelazimo na obrisi sirovinu
    }
    const handleSearch = (event) =>{
        let value = event.target.value.toLowerCase();
        let result = [];
        result = data.filter((data) => {
           
            return data[1].search(value) !== -1;
        });
        setFilteredData(result);
                }
    const edit = ()=>{
       
        return(
            <div>{errorMesagges === '' ? <>
        	    <ul className="nav nav-tabs actions-nav">
        		<li className="active"  >
                    <button className="btn btn-default">List</button>
                </li>
                <li>
                <input className="form-control" onChange={(event) =>handleSearch(event)} id="myInput" type="text" placeholder="Search.."></input>
                </li>
                 </ul> 
                 
            <table className="table table-hover"  >
                <thead>
                <tr>
                    <th>Edit</th>
                    <th>Obrisi</th>
                    <th>Ime Sirovine</th>
                    <th>Cena</th>
                    <th>Proizvodjac</th>
                </tr>
                </thead>
                <tbody id="myTable">
                {filteredData.map((item, i) => (
                    <tr key={i}>
                        <td>
                            <span onClick={()=>uredi(item[0],item[1],item[3],item[2],item[4])} className="fa fa-pencil glyphicon glyphicon-pencil"></span>
                        </td>
                        <td>
                            <span onClick={()=>obrisi(item[0],item[1],item[3],item[2],item[4])} className="fa fa-trash glyphicon glyphicon-trash"></span>
                        </td>
                        <td style={{display:'none'}}>{item[0]}</td>
                        <td>{item[1]}</td>
                        <td>{item[2]}</td>
                        <td >{item[3]}</td>
                        <td style={{display:'none'}}>{item[4]}</td> 
                        
                    </tr>
                ))}
            </tbody>
            </table>
            <br /><br />
            </>: <div className="alert alert-success alert-dismissible">
            <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
             {errorMesagges}</div>

            }
            </div>
        )
    }
    return(
        <div>
            {errorMesagges === '' ?
            <div>
                {stranica ===0 ? edit()  : null}
                {stranica ===1 ?
                        <AzurirajSirovinu role={role} props={props}  azuriraj={{idSirovine,imeSirovine,cenaSirovine,idDobavljaca,imeDobavljaca}}  />
                 : null}
                 {stranica ===2 ?
                    
                        <ObrisiSirovinu role={role} props={props} azuriraj={{idSirovine,imeSirovine,cenaSirovine }} />
                       
                    
                 : null}  
            </div> : 
                <div  className="alert alert-success alert-dismissible">
                    <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                    <strong>{errorMesagges}</strong>
            </div>
             }
        </div>
        
        
    );
};
export default SirovineEdit;