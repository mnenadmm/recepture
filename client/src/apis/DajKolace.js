import React, {useState, useEffect } from "react";
import DajPostupak from "./DajPostupak";

const DajKolace = ({role})=>{
    const[errorMesagges,setErrorMesagges]=useState('');
    const[data, setKolac]=useState([]);
    const [filteredData,setFilteredData] = useState(data); //ovo je pocetno stanje kolaca i dobija vrednost iz search
    const[stranica,setStranica]=useState(0);
    const[idKolaca, setIdKolaca]=useState(0);
    const[imeKolaca,setImeKolaca]=useState('');
    useEffect(()=>{
        fetch(`/dajlistuKolacaReact`,{
           method: "GET" 
        }).then((res)=>{
            if(res.status ===200){return res.json()}
        }).then((response)=>{
            if(response.error){setErrorMesagges(response.poruka)
            }else{
                setKolac(response);
                setFilteredData(response)
            }
        }).catch(error=>{
            console.log('ovo je greskaaaa ',error)
            setErrorMesagges('Neuspela konekcija sa bazom, proverite internet konekciju')
        })
    },[]);  
    const postupak=(id,imeKolaca)=>{
        setImeKolaca(imeKolaca)
        setIdKolaca(id)
        setStranica(1)
      }
      const handleSearch = (event) =>{
        let value = event.target.value.toLowerCase();
        let result = [];
        result = data.filter((data) => {
            return data[1].search(value) !== -1;
        });
        setFilteredData(result);
                }
    const kolaci =()=>{
        return (
            <div>
                <div className="row">
                    <div className="col-sm-12">
                    <input className="form-control" onChange={(event) =>handleSearch(event)} id="myInput" type="text" placeholder="Search.."></input>
                    </div>
                </div>
                <table className="table table-hover">
                <tbody>
                    <tr>
                        <th>Id kolaca</th>
                        <th>Ime kolaca</th>  
                    </tr>
                    {filteredData.map((item, i) => (
                        <tr key={i}>
                            <td>{item[0]}</td>
                            <td onClick={()=>{postupak(item[0],item[1])}}>{item[1]}</td>  
                        </tr>
                    ))}
                </tbody>
                </table>
                <br />
               
            </div>
        );
    }
    return(
        <div>
            {errorMesagges === '' ?
                <div>
                {stranica===0? kolaci() : null }
                
                {stranica===1 ? <DajPostupak role={role}  props={{idKolaca,imeKolaca}} /> : null}
            </div>:
            <div className="alert alert-success alert-dismissible">
            <p className="close" data-dismiss="alert" aria-label="close">&times;</p>
               <strong>{errorMesagges}</strong>
           </div>
        }
        </div>
        
    )
};
export default DajKolace ;