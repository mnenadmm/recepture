import React,{useState, useEffect} from "react";

const Dobavljaci = ()=>{
    const[data, setData]= useState([]);
    const URL ='/dajDobavljaceReact';
    useEffect(()=>{
       fetchData();
    },[]);
   
    const fetchData = ()=>{
        fetch(URL)
        .then((res) =>
            res.json())
        .then((response) => { 
        console.log(response)    //setData(response);
        })
    };
    return(
        <div>
           
            <table className="table table-hover">
                <tbody>
                    <tr>
                        <th>Id dobavljaca</th>
                        <th>Imedobavljaca</th>
                        <th>Telefon</th>
                        <th>Email</th>
                    </tr>
                    {data.map((item, i) => (
                    <tr key={i}>
                        <td>{item[0]}</td>
                        <td>{item[1]}</td>
                        <td>{item[2]}</td>
                        <td>{item[3]}</td>
                        
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    ) 
};
export default Dobavljaci;