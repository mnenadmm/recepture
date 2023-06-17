import React ,{useState,  useEffect}from "react";
import AdminSirovine from "./AdminSirovine";
const NutritivnaVrednostSirovine=({props})=>{
    const [stranica, setStranica] = useState(5)
    const [errorMesagges,setErrorMesagges]=useState('')
    const [messages,setMessages]=useState('')
    const [data, setData]=useState([])
    console.log(props)
   


    useEffect(() => {
        fetch(`/dajNutritivnuVrSirovine/${props.idSirovine}`,{
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
           
            
              setData(response)
              console.log(response)
                
              
                
            }
            
                    
            })
            .catch(error=>{
                console.log('ovo je greska ',error)
            
            })
},[])
const velikoSlovo = str => {
    return (
      str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    );
  };
    const tabelaSirovine=()=>{
      const promeni=(ime,value,broj)=>{
       // console.log(props.imeSirovine,ime,value,broj)
        
      }  
      const otkljucj=(i,x)=>{
        
         i=document.getElementById(i);
         x=document.getElementById(x);
        if (x.checked == true){
            i.disabled = false;
        }else{
            i.disabled = true;
        }
        
      }
    const azuriraj=()=>{
        let idSirovine=props.idSirovine;
        let imeSirovine=props.imeSirovine;
        let kcal=document.getElementById('kcal').value;
        let Kj=document.getElementById('Kj').value;
        let masti=document.getElementById('masti').value;
        let zasMasti=document.getElementById('zasMasti').value;
        let uh=document.getElementById('uh').value;
        let seceri=document.getElementById('seceri').value;
        let so=document.getElementById('so').value;
        let proteini=document.getElementById('proteini').value;
        if(kcal ===""){kcal=null}
        if(Kj ===""){Kj=null}
        if(masti ===""){masti=null}
        if(zasMasti ===""){zasMasti=null}
        if(uh ===""){uh=null}
        if(seceri ===""){seceri=null}
        if(so ===""){so=null}
        if(proteini ===""){proteini=null}
        const opt={
            method : 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                'idSirovine':idSirovine,
                'imeSirovine':imeSirovine,
                'kcal':kcal,
                'Kj':Kj,
                'masti':masti,
                'zasMasti':zasMasti,
                'uh':uh,
                'seceri':seceri,
                'so':so,
                'proteini':proteini
              })}
              fetch('/azurirajNutritivnuVrednostSirovine',opt)
              .then(resp =>{ 
                if(resp.status===200){ return resp.json()}   
            }).then(response=>{
                if(response.error){return setErrorMesagges(response.poruka)
                }else{
                    setMessages(response)
                }
            })
            .catch(error=>{
                console.log('Error: ',error)
            })
            
            setTimeout(function(){
                setStranica(0) 
                    },3000)
        
    }

    return(
        <div>
            {errorMesagges === '' ? 
            <div className="container">
                <div className="col-sm-12 text-center">
                    <h2>{velikoSlovo(props.imeSirovine)}</h2><br/><br/>
                </div><br />
                <br /><br />
                {messages !=='' ? 
                        <div className="alert alert-success alert-dismissible">
                            <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                            {messages}
                        </div> : null}
            
                {data.map((item,i)=>(
                <div key={i}>
                <div className="row" >
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                    <label >ImeSirovine:</label>
                    <input className="form-control" defaultValue={item[0]} disabled />
                    </div>
                </div> <br/>
                <div className="row" >
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                    <label >Cena sirovine:</label>
                    <input className="form-control" defaultValue={item[1]} disabled />
                    </div>
                </div><br/>
                <div className="row" >
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                    <label >Ime dobavljaca:</label>
                    <input className="form-control" defaultValue={item[2]} disabled />
                    </div>
                </div><br/>
                <div className="row" >
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                    <label >KCAL:</label>
                    <input id="kcal" type="number" className="form-control" defaultValue={item[3]} disabled />
                    <input id="checkKcal" type='checkbox' onChange={()=>otkljucj('kcal','checkKcal')}   /> <label>Otkljucaj</label>
                    </div>
                </div><br/>
                <div className="row" >
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                    <label >Kj:</label>
                    <input id="Kj" type="number" className="form-control" defaultValue={item[4]} disabled  />
                    <input id="checkKj" type='checkbox' onChange={()=>otkljucj('Kj','checkKj')}   /> <label>Otkljucaj</label>
                    </div>
                </div><br/>
                <div className="row" >
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                    <label >Masti:</label>
                    <input id="masti" type="number" className="form-control" defaultValue={item[5]} disabled />
                    <input id="checkMasti" type='checkbox' onChange={()=>otkljucj('masti','checkMasti')}   /> <label>Otkljucaj</label>
                    </div>
                </div><br/>
                <div className="row" >
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                    <label >Zasicene masti:</label>
                    <input type="number" id="zasMasti"  className="form-control" defaultValue={item[6]}  disabled/>
                    <input id="checkZasMasti" type='checkbox' onChange={()=>otkljucj('zasMasti','checkZasMasti')}   /> <label>Otkljucaj</label>
                    </div>
                </div><br/>
                <div className="row" >
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                    <label >Ugljeni hidrati:</label>
                    <input id="uh" type="number" className="form-control" defaultValue={item[7]}  disabled/>
                    <input id="checkUh" type='checkbox' onChange={()=>otkljucj('uh','checkUh')}   /> <label>Otkljucaj</label>
                    </div>
                </div><br/>
                <div className="row" >
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                    <label >Od toga seceri:</label>
                    <input id="seceri" type="number" className="form-control" defaultValue={item[8]} disabled />
                    <input id="checkSeceri" type='checkbox' onChange={()=>otkljucj('seceri','checkSeceri')}   /> <label>Otkljucaj</label>
                    </div>
                </div><br/>
                <div className="row" >
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                    <label >So:</label>
                    <input id="so" type="number" className="form-control" defaultValue={item[9]} disabled />
                    <input id="checkSo" type='checkbox' onChange={()=>otkljucj('so','checkSo')}   /> <label>Otkljucaj</label>
                    </div>
                </div><br/>
                <div className="row" >
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                    <label >Proteini:</label>
                    <input id="proteini" type="number" className="form-control" defaultValue={item[10]} disabled />
                    <input id="checkProteini" type='checkbox' onChange={()=>otkljucj('proteini','checkProteini')}   /> <label>Otkljucaj</label>
                    </div>
                </div><br/><br/><br/><br/>

                </div> 
                    ))}
                <div className="col-sm-12 text-center">
                <button onClick={()=>{azuriraj()}} className="btn btn-primary">Save</button>
                </div>
                <div className="row">
                    <div className="col-sm-2">
                         <button className="btn btn-primary btn-sm" onClick={()=>setStranica(4)}>back</button>
                    </div>
                 </div>
                 <br/><br/><br/><br/>
            </div>
            
            : <div className="alert alert-success alert-dismissible">
                <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                   <strong>{errorMesagges}</strong>
               </div>}
           
           
            
           
        </div>
    )
    }
    return(
        <div>
           {stranica ===5 ? tabelaSirovine() : null} 
           {stranica ===4 ? <AdminSirovine /> : null}
        </div>
    )
}
export default NutritivnaVrednostSirovine;