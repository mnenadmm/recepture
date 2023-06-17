import { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'
function App({props}) {
  const [kcal, getKcal]=useState(null)
  const [kolicina,setKolicina]=useState(0)
  const [kj, setKj]=useState(null)
  const [masti, setMasti]=useState(null)
  const [zasiceneMasti,setZasiceneMasti]=useState(null)
  const [ugljeniHidrati,setUgljeniHidrati]=useState(null)
  const [so, setSo]=useState(null)
  useEffect(() => {
    fetch('/a',{
        method: "GET",
        headers: {   
        }
    })
        .then((res) =>{
            if(res.status===200){ return res.json()}    
        })   
        .then((response) => {  
         const kolicina= response.map(item => item[2]).reduce((saberi, sab)=>saberi+sab);
          const kcal=response.map(item => item[3]).reduce((saberi, sab)=>saberi+sab);
          const kj=response.map(item => item[4]).reduce((saberi, sab)=>saberi+sab); 
          const masti=response.map(item => item[5]).reduce((saberi, sab)=>saberi+sab);       
          const zasicene_masti=response.map(item => item[6]).reduce((saberi, sab)=>saberi+sab); 
          const ugljeniHidrati=response.map(item => item[7]).reduce((saberi, sab)=>saberi+sab);    
          const so=response.map(item => item[8]).reduce((saberi, sab)=>saberi+sab);   
                setKolicina(kolicina.toFixed(2))
                getKcal((kcal/kolicina*0.1).toFixed(2))
                setKj((kj/kolicina*0.1).toFixed(2))
                setMasti((masti/kolicina*0.1).toFixed(2))
                setZasiceneMasti((zasicene_masti/kolicina*0.1).toFixed(2))
                setUgljeniHidrati((ugljeniHidrati/kolicina*0.1).toFixed(2))
                setSo((so/kolicina*0.1).toFixed(2))
                response.map((item,i)=>{
                  if(item[3]===null){getKcal(null)}
                  if(item[4]===null){setKj(null)}
                  if(item[5]===null){setMasti(null)}
                  if(item[6]===null){setZasiceneMasti(null)}
                  if(item[7]===null){setUgljeniHidrati(null)}
                  if(item[8]===null){setSo(null)}
                });
                ;
        })
        .catch(error=>{
            console.log('ovo je greska ',error)
        
        })
},[])

  return (
    <div>
      kcal  {kcal} <br />
      Kj  {kj} <br />
      masti  {masti} <br />
      zasiceneMasti  {zasiceneMasti}<br />
      ugljeni hidrati  {ugljeniHidrati}<br />
      so  {so}<br />
      kolicina   {kolicina}
    </div>
  );
}

export default App;