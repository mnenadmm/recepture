import React ,{useState,  useEffect}from "react";
import Select from "./Select";
function IzlistajSirovine({props,role}) {
    const[data, getData] = useState([])
    const [filteredData,setFilteredData] = useState(data);
    const[errorMesagges,setErrorMesagges]=useState('');
    const URL_Dobavljac = '/dajImeDobavljacaIdReact';
    const[showSelect, setshowSelect]=useState(0) // javlja se problem sa selektom
    useEffect(() => {
            fetch('/izlistaj/sirovine/react',{method: "GET",headers: {}
            }).then((res) =>{if(res.status===200){ return res.json()}    })   
                .then((response) => {  if(response.error){console.log(response)
                    return setErrorMesagges(response.poruka)
                   }
                        getData(response);
                        setshowSelect(1); // prikazuje select
                        setFilteredData(response)
                }).catch(error=>{console.log('ovo je greska ',error)})},[])
    const promena =(id)=>{
        if(id >0 ){        
            fetch(`/sirovinePoDobavljacuReact/${id}`,{method: "GET"})
                .then((res) =>{
                    if(res.status===200){ return res.json()}})
                    .then((response) => { 
                        if(response.error){ return setErrorMesagges(response.poruka)}
                        else{
                            getData(response); 
                            setFilteredData(response) }})
                    .catch(error=>{console.log('ovo je greska ',error)})
        }else{ getData([])}
    }
    const handleSearch = (event) =>{
        let value = event.target.value.toLowerCase();
        let result =data.filter((item=>{
            const naziv = item[1] ? String(item[1]).toLowerCase() : '';
            return naziv.includes(value);
        }))
        setFilteredData(result);
         }
         const lista = () => {
            return (
                <div className="container">
                    {errorMesagges === '' ? (
                        <>
                            {showSelect === 1 ? (
                                <Select
                                    role={role}
                                    promena={promena}
                                    options={URL_Dobavljac}
                                    setErrorMesagges={setErrorMesagges}
                                    ime="Izlistaj po Dobavljacu..."
                                />
                            ) : null}
        
                            <br />
                            <div>
                                <input
                                    className="form-control"
                                    placeholder="Search"
                                    onChange={handleSearch}
                                />
                            </div>
        
                            {filteredData.length > 0 ? (
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
                                </table>
                            ) : (
                                <div className="alert alert-warning mt-3">
                                   Nema sirovina od ovog dobavljaca
                                </div>
                            )}
                            <br />
                        </>
                    ) : (
                        <div className="alert alert-success alert-dismissible">
                            <p
                                className="close"
                                data-dismiss="alert"
                                aria-label="close"
                            >
                                &times;
                            </p>
                            <strong>{errorMesagges}</strong>
                        </div>
                    )}
                </div>
            );
        };
        

return(
    <div>
          {lista()}
    </div>
)
}
export default IzlistajSirovine;
