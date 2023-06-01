import Select from "../components/Select"
import { useState } from "react"
import DodajURecepturu from "./DodajURecepturu"

const NapraviRecepturu = ({role})=>{
    const[errorMesagges,setErrorMesagges]=useState('');
    const[idKolaca, setIdKolaca]=useState(0)
    const [data, getData] = useState([])
    const[naslov, setNaslov]=useState(0)
    const[kolicina, setKolicina]=useState(0)
    const[dodaj, setDodaj]=useState(0)// nakon sto se izabere kolac daje unos sirovine
  
    const[idSirovine, setIdSirovine]=useState(0)
    const [components, setComponents] = useState(["Sample Component"]);
    const URL ='/dajlistuKolacaBezReceptureReact';
    
    const dajKolac=(id)=>{
        
        setIdKolaca(Number(id));
        
           fetch(`/dajImeKolacaReact/${id}`,{
                method: "GET",
                headers: {
                    
                  }
            })
            .then((res) =>{
                if(res.status===200){ return res.json()}
                })
                .then((response) =>getData(response[0]))
                .catch(error=>{
                    console.log('ovo je greska ',error)
                   
                })
            setNaslov(1)
            setDodaj(1)
            
        

    }
    const vrednost = (e)=>{
        setKolicina(e);
    }
    
    const dodajSirovinu=(e)=>{
        setIdSirovine(e)
        
        
   
    }
    const addComponent=()=>{
         
    setComponents([...components, "Sample Component"])
    const x=[];
    x.push(idKolaca,kolicina,idSirovine) 
    fetch('/napraviRecepturuReact', {
        method: 'POST',
            headers: {
                
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ //moramo poslati u JSON formatu
                idKolaca : idKolaca,
                kolicina: kolicina,
                idSirovine : idSirovine
            })
        }).then((res) =>{
            if(res.status===200){ return res.json()}
            }).then((response=>{
                if(response.error){return setErrorMesagges(response.poruka)}
            else{
                 console.log(response[1])
            }
            }))
        
    }
   
    const novaReceptura=()=>{
    return(
        <div>
             {errorMesagges ==='' ?
                <div>
                <div className="row">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4"> {naslov ===0 ? 
                        <Select 
                        setErrorMesagges={setErrorMesagges} 
                        
                        promena={dajKolac} 
                         options={URL} ime='Izaberite kolac...'
                         role={role} />
                    :null}
                    {naslov !==0 ? 
                   <div className="col-sm-12 text-center"><h2>{data}</h2></div>  
                    :null}
                    </div>
                </div>
               <br /><br /><br />

            </div>:
            <div className="alert alert-success alert-dismissible">
            <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
               <strong>{errorMesagges}</strong>
           </div>

            }
        </div>
        
       
        
       
    )
}

 return(
    <div>
        {errorMesagges ==='' ?
            <div>
                {novaReceptura ()}
                {dodaj !==0 &&
                    components.map((item, i) => ( <DodajURecepturu role={role}  props={{dodajSirovinu,vrednost}} key={i} /> ))}
                    <br />
                {dodaj !==0 &&
                    <button onClick={addComponent} text="Call Component">Dodaj</button> }    
            
            
    
            </div>:
            <div className="alert alert-success alert-dismissible">
            <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
               <strong>{errorMesagges}</strong>
           </div>
    }
    </div>
    
 )}
export default NapraviRecepturu;