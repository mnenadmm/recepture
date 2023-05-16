import React,{ useState} from "react";
import Select from "../components/Select";
import Cart from "./Cart";
import { useCart } from "react-use-cart";



const NaruciSirovine = ({role})=>{
    const[errorMesagges,setErrorMesagges]=useState('');
    const { addItem } = useCart();
    const [data, getData] = useState([])
    const URL_Dobavljac = '/dajImeDobavljacaIdReact'; 
    const promena =(id)=>{
        // mora biti intiger, da ne bi gresku u endpointu prijavljivao
        //odnosno salje upit samo ako je id string
        if(id >0 ){
        const URL_Sirovina = `/sirovinePoDobavljacuReact/${id}`;
        fetch(URL_Sirovina,{
            method: "GET",
            headers: {
              
              }
        })
            .then((res) =>{
                if(res.status===200){ return res.json()}
           if(res.status===401){return  setErrorMesagges('Vasa sessija je istekla, konektujte se ponovo ERROR: 401 ')}
           
           if(res.status===422){return  setErrorMesagges('Neregularna konakcija, molimo Vas da se ispravno konektujete konektujete  ERROR: 422 ')}
           if(res.status===10){return  setErrorMesagges('Nemate pristup ovom delu aplikacije ')}
            })
                
            .then((response) => { 
                getData(response);

            })
            .catch(error=>{
                console.log('ovo je greska ',error)
                setErrorMesagges('Neuspela konekcija sa bazom, proverite internet konekciju')
            })
            
        }else{
            getData([])
        } 
    }
    const naruci =()=>{ 
        const aki = data;
        let zbir=[];
        let arrayLength = aki.length;
        for(let i = 0 ; i < arrayLength; i++) {
            
           let val = aki[i];
           let s={
            "ime":val[1],
            'price':val[2],
            'id':val[0],
            'quantity':val[3]

           }
           zbir.push(s)
           
        }
           
        return(
            <div className="col-sm-12">
            
            <div>
                {errorMesagges}
                <br /><br />
            </div>
            {zbir.map((item) => ( 
            <div className="row" key={item.id} id={item.id}>

                <div className="col-sm-3">
                    
                    <input className="form-control" defaultValue={item.ime} disabled /> <br />
                </div>
                <div className="col-sm-3" >
                    <input className="form-control" defaultValue={item.price} disabled /> <br />
                </div>
                <div className="col-sm-3">
                    
                    <input type="number" className="form-control" placeholder="Unesi kolicinu"  /> <br />
                </div>
                <div className="col-sm-3 text-center"> 
                    <button className="btn btn-primary"
                    
                        onClick={(e)=>{
                            const kolicina=Number(e.target.parentNode.previousElementSibling.firstChild.value);
                            addItem(item,kolicina)
                            if(kolicina !==0){ document.getElementById(item.id).style.display = "none" }                     
                        }}
                          
                        
                        >Dodaj
                    </button>
                </div><br />
            </div>
           
            ))}
           
     </div>
        )
    }
    return(
        <div>
            {errorMesagges === '' ?
                <div> 
                <Cart />
                <Select 
                    role={role}
                    promena={promena} 
                    options={URL_Dobavljac} 
                   
                    setErrorMesagges={setErrorMesagges}
                    ime='Izlistaj po Dobavljacu...' 
                 />
                 {data !==[] ? naruci() : null} 
            </div>:
            <div className="alert alert-success alert-dismissible">
            <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
               <strong>{errorMesagges}</strong>
           </div>

            }
        </div>
        
    )
}

export default NaruciSirovine;