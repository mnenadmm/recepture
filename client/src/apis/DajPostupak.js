import React, {useState, useEffect } from "react";
import DajKolace from "./DajKolace";

const DajPostupak = ({props,role})=>{
    
    const[nazad,setNazad]=useState(0);// vraca nazad
    const[errorMessages,setErrorMessages]=useState('');
    const[postupak, setPostupak]=useState(false)//da li se prikazuje postupak
    const[objasnjenje,setObjasnjenje]=useState([])//objasnjenje kolaca
    const[recept, setRecept]=useState([])//receptura
    
    
    
    useEffect(()=>{
        const proba=()=>{// pokusavam d otklonim error
        fetch(`/dajRecepturuReact/${props.idKolaca}`,{
            method: "GET",
            headers: {  
            }
        })
        .then((res) =>{
          if(res.status===200){return res.json()}
        })
        .then((response) => { 
            if(response.error){return setErrorMessages(response.poruka)
            }else{
                return setRecept(response)
            }  
        }).catch((error)=>{
            console.log('ERROR: ',error)
        });
        fetch(`/dajPostupakZaRecepturu/${props.idKolaca}`,{
            method: "GET",
            headers: {
              }
        })
        .then((res) =>{
         if(res.status===200){return res.json()}   
        })
        .then((response) => { 
             if(response.error){return setErrorMessages(response.poruka)
            }else{
                return setObjasnjenje(response);
            }  
        }).catch((error)=>{
            console.log('ERROR: ',error)
        })
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
    const Receptura=()=>{
        const prikazi=()=>{
           
            setPostupak(a=>!a)//ovo znacisuprotno od postojeceg
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
           </table>
            <button type="button"onClick={()=>prikazi()} className="btn btn-info">Postupak</button>
                {postupak ===true? pokazi() : null}
                <br></br><br></br><br></br><br></br>
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
    return(
        <div>
            {nazad===0 ? Receptura() : <DajKolace role={role}  />}   
        </div>
    )
}
export default DajPostupak;