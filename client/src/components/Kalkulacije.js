import { useState, useEffect } from "react";
import DajKalkulaciju from "../apis/DajKalkulaciju";
const Kalkulacije = ({role})=>{
    const[stranica, setStranica]=useState(0)
    const[errorMesagges,setErrorMesagges]=useState('');
    const[ime, setIme]=useState([])
    const [filteredData,setFilteredData] = useState(ime); //ovo je pocetno stanje kolaca i dobija vrednost iz search
    const[imeKolaca, setImeKolaca]=useState('');
    const[idKolaca, setIdKolaca]=useState(0);
  
    useEffect(() => {
        fetch('/listaKolacaNaslovReact',{
            method: "GET",
            headers: {
                 
              }
        })
        .then((res) =>{
            if(res.status===200){ return res.json()} 
        })
            .then((response) => { 
                if(response.error){return setErrorMesagges(response.poruka)
                }else{
                setIme(response)
                setFilteredData(response)}
            })
            .catch(error=>{
                console.log('ovo je greska ',error)
                setErrorMesagges('Neuspela konekcija sa bazom, proverite internet konekciju')
            })
        
    }, [])
    const dajId=(e)=>{
        setIdKolaca(e.target.value)
        setImeKolaca(e.target.innerHTML)
        setStranica(1)
    }
    const dajKolace=()=>{
        const handleSearch = (event) =>{
            let value = event.target.value.toLowerCase();
            let result = [];
            result = ime.filter((ime) => {
                
                return ime[1].search(value) !== -1;
            });
            setFilteredData(result);
        }    
    return(
        <div className="container">
            <div className="row">
                <div className="col-sm-12">
                <input className="form-control" onChange={(event) =>handleSearch(event)} id="myInput" type="text" placeholder="Search.."></input>
                </div>
            </div>
            <br />
            {filteredData.map((item, i) => (
            <div key={i} className="row">
                <div className="col-sm-4"></div>
                <div className="col-sm-4">
                <button  className="btn btn-default btn-lg  btn-block" onClick={(e)=>dajId(e)} value={item[0]}>{item[1]}</button>
                <br/><br/>
                </div>
            </div>
           ))}
        </div>
    )}
    return(
        <div>
            {errorMesagges ==='' ?
                <div>
                    {stranica===0? dajKolace(): <DajKalkulaciju role={role}  props={{idKolaca, imeKolaca}} />}
                </div>:
                <div className="alert alert-success alert-dismissible">
                    <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                        <strong>{errorMesagges}</strong>
               </div>
            }
        </div>
    )
}
export default Kalkulacije;