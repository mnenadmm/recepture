import React ,{useState,  useEffect}from "react";
import Select from "./Select";
function IzlistajSirovine({props,role}) {
    const[data, getData] = useState([])
    const [filteredData,setFilteredData] = useState(data);
    const[errorMesagges,setErrorMesagges]=useState('');
    const URL_Dobavljac = '/dajImeDobavljacaIdReact';
    const[showSelect, setshowSelect]=useState(0) // javlja se problem sa selektom
    //moze se prikazati samo ako korisnik im pravo pristupa
    
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
                   if(response.error){console.log(response)
                    return setErrorMesagges(response.poruka)
                   }
                        getData(response);
                        setshowSelect(1); // prikazuje select
                        setFilteredData(response)
                       
                })
                .catch(error=>{
                    console.log('ovo je greska ',error)
                
                })
    },[])//moramo dodati da seucitaju varijable u useEffect da ne bi izbacivalo uozorenje
    // prikazuje sirovine po dobavljacima
    const promena =(id)=>{
        // mora biti intiger, da ne bi gresku u endpointu prijavljivao
        //odnosno salje upit samo ako je id string
        if(id >0 ){        
        
        fetch(`/sirovinePoDobavljacuReact/${id}`,{
            method: "GET"})
        .then((res) =>{
            if(res.status===200){ return res.json()}
        })
            .then((response) => { 
                if(response.error){ return setErrorMesagges(response.poruka)}
                else{
                    getData(response); 
                    setFilteredData(response)
                    
                } 
            })
            .catch(error=>{
                console.log('ovo je greska ',error)
                
            })
        }else{
            getData([])
        }
    }
    const handleSearch = (event) =>{
        let value = event.target.value.toLowerCase();
        let result =data.filter((item=>{
            const naziv = item[1] ? String(item[1]).toLowerCase() : '';
            return naziv.includes(value);
        }))
        
        setFilteredData(result);
                }

    const lista=()=>{
        
    return(
        <div className="container">
            {errorMesagges === '' ? <> 
            {showSelect === 1 ? 
            <Select  role={role} promena={promena} options={URL_Dobavljac}setErrorMesagges={setErrorMesagges} ime='Izlistaj po Dobavljacu...' />
               : null }
            <br></br>
           <div>
            <input className="form-control" placeholder="Search" onChange={(event) =>handleSearch(event)} />
           </div>
            <table className="table table-hover">
            <tbody>
                <tr>
                    
                    <th>Ime</th>
                    <th>Cena</th>
                    <th>Proizvodjac</th>

                </tr>
                {filteredData.map((item, i) => (
                    <tr key={i}>
                        
                        <td>{item[1]}</td>
                        <td>{item[2]}</td>  
                        <td>{item[3]}</td>
                        
                    </tr>
                ))}
            </tbody>
            </table><br />
            </>:
                <div className="alert alert-success alert-dismissible">
                <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                   <strong>{errorMesagges}</strong>
               </div>
            }
           
        </div>
    );
    };

return(
    <div>
        {data.length > 0 ? lista() : null}
    </div>
)
}
export default IzlistajSirovine;
