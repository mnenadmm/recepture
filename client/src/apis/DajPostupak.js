import React, {useState, useEffect } from "react";
import DajKolace from "./DajKolace";

const DajPostupak = ({props,role})=>{
    
    const[nazad,setNazad]=useState(0);// vraca nazad
    const[errorMessages,setErrorMessages]=useState('');
    const[postupak, setPostupak]=useState(false)//da li se prikazuje postupak

    const[nutTabela, setNutTabela]=useState(false)//prikazuje tabelu nutritivnih vrednosti
    const[objasnjenje,setObjasnjenje]=useState([])//objasnjenje kolaca
    const[recept, setRecept]=useState([])//receptura
    const [bezNut, setBezNut]=useState([])//bez nut. vrednosti
    const[respon1, setRespon1]=useState([])
    const[respon2, setRespon2]=useState([])
    const [vratiRecept, setVratiRecept]=useState([])
  const [kcal, getKcal]=useState(null)
  const [kolicina,setKolicina]=useState(0)
  const [kj, setKj]=useState(null)
  const [masti, setMasti]=useState(null)
  const [zasiceneMasti,setZasiceneMasti]=useState(null)
  const [ugljeniHidrati,setUgljeniHidrati]=useState(null)
  const [so, setSo]=useState(null)
  const [seceri, setSeceri]=useState(null)
  const [proteini, setProteini]=useState(null)
  
    
    
    useEffect(()=>{
        const proba=()=>{// pokusavam d otklonim error
            
        fetch(`/dajRecepturuReact/${props.idKolaca}`,{
            method: "GET",
            headers: {  
            }}).then((res) =>{if(res.status===200){return res.json()}}).then((response) => { 
            if(response.error){return setErrorMessages(response.poruka)
            }else{
                
                 setRecept(response[2])//normalna receptura
                 setRespon1(response[0])//sa vrednosti
                 setRespon2(response[1])//bez vrednosti
                 setVratiRecept(response[2])
                 
            }
        }).catch((error)=>{console.log('ERROR: ',error)});
        fetch(`/dajPostupakZaRecepturu/${props.idKolaca}`,{
            method: "GET",
            headers: {}}).then((res) =>{
         if(res.status===200){return res.json()}   })
        .then((response) => { 
             if(response.error){return setErrorMessages(response.poruka)
            }else{return setObjasnjenje(response);}  
        }).catch((error)=>{console.log('ERROR: ',error)})
        fetch(`/dajNutritivnuVrednostKolaca/${props.idKolaca}`,{
            method: "GET",
            headers: {}}).then((res) =>{
         if(res.status===200){return res.json()}   })
        .then((response) => { 
             if(response.error){return setErrorMessages(response.poruka)
            }else{
                console.log(response)
                const kolicina= response.map(item => item[2]).reduce((saberi, sab)=>saberi+sab);
          const kcal=response.map(item => item[3]).reduce((saberi, sab)=>saberi+sab);
          const kj=response.map(item => item[4]).reduce((saberi, sab)=>saberi+sab); 
          const masti=response.map(item => item[5]).reduce((saberi, sab)=>saberi+sab);       
          const zasicene_masti=response.map(item => item[6]).reduce((saberi, sab)=>saberi+sab); 
          const ugljeniHidrati=response.map(item => item[7]).reduce((saberi, sab)=>saberi+sab);    
          const so=response.map(item => item[8]).reduce((saberi, sab)=>saberi+sab);
          const seceri=response.map(item => item[9]).reduce((saberi, sab)=>saberi+sab);   
          const proteini=response.map(item => item[10]).reduce((saberi, sab)=>saberi+sab);      
          setKolicina(kolicina.toFixed(2))
                getKcal((kcal/kolicina*0.1).toFixed(2))
                setKj((kj/kolicina*0.1).toFixed(2))
                setMasti((masti/kolicina*0.1).toFixed(2))
                setZasiceneMasti((zasicene_masti/kolicina*0.1).toFixed(2))
                setUgljeniHidrati((ugljeniHidrati/kolicina*0.1).toFixed(2))
                setSo((so/kolicina*0.1).toFixed(2))
                setSeceri((seceri/kolicina*0.1).toFixed(2))
                setProteini((proteini/kolicina*0.1).toFixed(2))
                response.map((item,i)=>{
                    if(item[3]===null){getKcal(null)}
                    if(item[4]===null){setKj(null)}
                    if(item[5]===null){setMasti(null)}
                    if(item[6]===null){setZasiceneMasti(null)}
                    if(item[7]===null){setUgljeniHidrati(null)}
                    if(item[8]===null){setSo(null)}
                    if(item[9]===null){setSeceri(null)}
                    if(item[10]===null){setProteini(null)}
                  });
                
                ;}  
        }).catch((error)=>{console.log('ERROR: ',error)})
       }//kraj proba
       proba()
    },[props.idKolaca]);
    const pokazi = ()=>{
        return(
            <div>
                {errorMessages ==='' ?
            <div>
                <textarea className="form-control" rows="7" cols="30" defaultValue={objasnjenje} disabled ></textarea>
                <br /><br />
            </div>
            :
            <div className="alert alert-success alert-dismissible">
                <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                    <strong>{errorMessages}</strong>   
            </div>
        }
            </div>
        )
    }
    const nutritivnaTabela=()=>{

      return(
        <div className="container">
            {errorMessages ==='' ?
            <div>
               <table className="table table-striped  table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Nutritivna vrednost proizvoda na 100gr</th>
                    <th scope="col">Kolicina</th>
                  </tr>
                </thead>
                
                <tbody >
                  <tr>
                    <td>Kcal</td>
                    <td>{kcal}</td>
                  </tr>
                  <tr>
                    <td>Kj</td>
                    <td>{kj}</td>
                  </tr>
                  <tr>
                    <td>Masti</td>
                    <td>{masti}</td>
                  </tr>
                  <tr>
                    <td>Zas. masne kiseline</td>
                    <td>{zasiceneMasti}</td>
                  </tr>
                  <tr>
                    <td>Ugljeni hidrati</td>
                    <td>{ugljeniHidrati}</td>
                  </tr>
                  <tr>
                    <td>Od toga seceri</td>
                    <td>{seceri}</td>
                  </tr>
                  <tr>
                    <td>So</td>
                    <td>{so}</td>
                  </tr>
                  <tr>
                    <td>Proteini</td>
                    <td>{proteini}</td>
                  </tr>
                </tbody>  
           
           </table>
                <br /><br />
            </div>
            :
            <div className="alert alert-success alert-dismissible">
                <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                    <strong>{errorMessages}</strong>   
            </div>
        }
        </div>
      )
    }
    const Receptura=()=>{
        const prikaziNutr=()=>{

          if(respon2 !==[]){
            setRecept(respon1)
            setBezNut(respon2)
          } 
          setNutTabela(a=>!a)
          if(nutTabela){
            setRecept(vratiRecept)
            setBezNut([])  
          }
        }
        const prikazi=()=>{
           
            setPostupak(a=>!a)//ovo znaci suprotno od postojeceg
        }
        return(
            <div>
                {errorMessages ==="" ?
            <div className="container">
                <ul className="nav nav-tabs actions-nav">
                <li>
                    <button className="btn btn-default" onClick={()=>setNazad(1)}>List</button>
                </li>
                <li className="active">
                    <button className="btn btn-default">Objasnjenje</button>
                </li>
                </ul>
                <div className="row">
                <br></br><br></br>
                <div className="col-sm-4"></div>
                <div className="col-sm-4 text-center">
                    <h2>{props.imeKolaca}</h2>
                </div>
            </div>
            <br />
            <br /><br />
            <table className="table table-striped  table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Sirovina</th>
                    <th scope="col">Kolicina</th>
                  </tr>
                </thead>
            {recept.map((item, i) => (
                <tbody key={i}>
                  <tr>
                    <td>{item[0]}</td>
                    <td>{item[2]}</td>
                  </tr>
                </tbody>  
            ))}
            {bezNut.map((item, i) => (
                <tbody key={i}>
                  <tr>
                    <td style={{'color':'red'}}>{item[0]}</td>
                    <td>{item[2]}</td>
                  </tr>
                </tbody>  
            ))}
           </table>
           
           <div className="col-sm-6">
              <button type="button"onClick={()=>prikazi()} className="btn btn-info">Postupak</button>
           </div>
           <div className="col-sm-6">
              <button  type="button"onClick={()=>(prikaziNutr())} className="btn btn-info">Tabela Nutritivnih vrednosti</button>
           </div>
           
                {postupak ===true? pokazi() : null}
                <br></br><br></br><br></br><br></br>
                {nutTabela === true ? nutritivnaTabela() : null}
                <br></br><br></br><br></br><br></br>
            </div>
                :
                <div className="alert alert-success alert-dismissible">
                        <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                    <strong>{errorMessages}</strong>
                </div>
                }
                
              
              <br />
            </div>
        )
    }
    return(
        <div>
            {nazad===0 ? Receptura() : <DajKolace role={role}  />}   
        </div>
    )
}
export default DajPostupak;