import React ,{useState,  useEffect}from "react";
import Administrator from "./Administrator";
import Select from "./Select";
import NutritivnaVrednostSirovine from "./NutritivnaVrednostSirovine";
const SirovineAdmin=()=>{
    const[idSirovine, setIdSirovine]=useState(0)
    const[imeSirovine, setImeSirovine]=useState('')
    const [stranica, setStranica] = useState(4)
    const[errorMesagges,setErrorMesagges]=useState('');
    const[data, getData] = useState([])
    const [filteredData,setFilteredData] = useState(data);
    const[showSelect, setshowSelect]=useState(0) // javlja se problem sa selektom
    //moze se prikazati samo ako korisnik im pravo pristupa
    const URL_Dobavljac = '/dajImeDobavljacaIdReact';
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
    let result = [];
    result = data.filter((data) => {
        
        return data[1].search(value) !== -1;
    });
    setFilteredData(result);
            }
    const sirovina=(id,imeSirovine)=>{
       
        setIdSirovine(id)
        setImeSirovine(imeSirovine)
        setStranica(5)
    }
    const listaSirovina=()=>{

        return(
            <div className="container">
            <div className="col-sm-12">
            {errorMesagges === '' ? <> 
            {showSelect === 1 ? 
            <Select  promena={promena} options={URL_Dobavljac}setErrorMesagges={setErrorMesagges} ime='Izlistaj po Dobavljacu...' />
               : null }
            <br></br>
           <div>
            <input className="form-control" placeholder="Search" onChange={(event) =>handleSearch(event)} />
           </div>
           <br/>
                
                {filteredData.map((item, i) => (
                   <div className="row" key={i}>
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4" > 
                        <button className='btn btn-default btn-lg  btn-block' onClick={() => sirovina(item[0],item[1])} >{item[1]}</button>
                        </div>
                    </div>
                ))}
          
            <div className="col-sm-4">
            <button className="btn btn-primary btn-sm" onClick={()=>setStranica(0)}>Back</button>
            </div>
            <div className="col-sm-4"></div>
            </>:
                <div className="alert alert-success alert-dismissible">
                <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                   <strong>{errorMesagges}</strong>
               </div>
            }
           <br/><br/> <br/><br/>  
            </div>
            </div>
        )
    }
    return(
        <div>
            {stranica === 4 ? listaSirovina() : null}
            {stranica === 0 ? <Administrator /> : null}
            {stranica === 5 ? <NutritivnaVrednostSirovine props={{idSirovine,imeSirovine}} /> :null}
        </div>
    )
}
export default SirovineAdmin;