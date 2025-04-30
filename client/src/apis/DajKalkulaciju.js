import { useState, useEffect } from "react";
import Kalkulacije from "../components/Kalkulacije";
import AzurirajRabat from "./AzurirajRabat";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'
import './DajKalkulaciju.css'
const DajKalkulaciju =({props,role})=>{
    const current = new Date();
    var datum =`${current.getDate()}.${current.getMonth()+1},${current.getFullYear()}`
    const[stranica, setStranica]=useState(1)
    const [data,setData]=useState([])
    const[zbir, setZbir]=useState(0)
    const[errorMessages, setErrorMessages]=useState('')
    const[items, setItems]=useState()//koristi se za azuriranje rabata
    const[postupak,setPostupak]=useState([])
    const[kolicina, setKolicina]=useState([]);//ovo je gramaza kolaca
    const [open, setOpen] =useState(false);

    const handleOpen = () => {
      setOpen(!open);
    };
    
    useEffect(() => {
        const proba=()=>{
        fetch(`/dajRecepturuReact/${props.idKolaca}`,{
            method: "GET",
            headers: { }}).then((res) =>{if(res.status===200){return res.json() }})  
        .then((response) => { if(response.error){return setErrorMessages(response.poruka)}
                else{setData(response[2])

                const cena=response[2].map(item=> item[4]).reduce((saberi, sab)=>saberi+sab);
                setZbir(cena.toFixed(2)) 
                //ovo je ukupna kolicina sirovina u recepturi
                let kolicinaRecepture=response[2].map(item=>item[2]).reduce((x,y)=>x+y);
                //prvi je ime sirovine a drugi kolicina sirovine podeljena sa ukupnom kolicinom sirovina
                setKolicina(response[2].map(item=>([
                   item[0],item[2]/kolicinaRecepture //proveriti formulu
                ])))
               
                } 
             
        fetch(`/dajPostupakZaRecepturu/${props.idKolaca}`,{
            method: "GET",
            headers: {}}).then((res) =>{
                 if(res.status===200){return res.json()}})
                .then((response) => { 
                     if(response.error){return setErrorMessages(response.poruka)
                    }else{ return setPostupak(response);}  
                }).catch((error)=>{console.log('ERROR: ',error)}) 
            })}  
        proba()
    },[props.idKolaca]);
    const promeniRabat=(items)=>{
        setItems(items)
        setStranica(2)  
    }
    const createZaKg=()=>{
        var doc = new jsPDF()
        const velikoSlovo = str =>{
            return (str.charAt(0).toUpperCase() + str.slice(1).toLowerCase());  
        } 
        // daje sirinu i visinu stranice
        var width = doc.internal.pageSize.getWidth()
        var height=doc.internal.pageSize.getHeight()
        //naslov 
        doc.text(`NN: ${velikoSlovo(props.imeKolaca)}` , width/2, 10, { align: 'center' })
        doc.text('Kolicina sirovine u 1kg proizvoda',15,25)
        // head od tabele
        var head = [['Ime sirovine','Kolicina']]
        // body
        var body=[]
        kolicina.map((item,i)=>(
            body.push([velikoSlovo(item[0]),item[1]])
       ))
       // creiranje tabele
       doc.autoTable({
        columnStyles: { 
            0 : {   fontSize:14},
            1 : {   fontSize:14}
          },
          head:head,
          body: body,
          startY: 30// odakle krece tabela
         // theme: 'grid', ovde idu teme
                   })
        // vraca mesto gde se tabela zavrsava
        let krajTabele = doc.previousAutoTable.finalY;
        doc.setFontSize(14);
        //////
        const footer =()=>{
            if(currentpage < doc.internal.getNumberOfPages()){
              doc.setFontSize(8);
              var line =doc.line(10, height-5, 200, height-5)
              var infoIme = doc.text(`${role.infoKorisnika[0]} ${role.infoKorisnika[1]}`,width/8,height-2);
              var infoEmail=doc.text(`${role.infoKorisnika[2]}`,width/4,height-2);
              var infoAdresa =doc.text(`${role.infoKorisnika[3]}`,width/2.2,height-2);
              var infoDatum =doc.text(`datum: ${datum}`,width-45,height-2);
              var telefon=doc.text(`${role.infoKorisnika[4]}`,width-75,height-2); 
              return line,infoIme,infoEmail,infoAdresa,infoDatum,telefon
            }
          }
          var currentpage = 0;
          const strana =()=>{
            if(currentpage < doc.internal.getNumberOfPages()){
              var str="Page " + doc.internal.getNumberOfPages();
              return str
            }
          }
          footer()
          doc.text(strana(),width-15,height-7 , { align: 'center' })
       
            doc.output('dataurlnewwindow');
            doc.save(`nn ${props.imeKolaca}`);
    };// krj createZak



    const createPdf=()=>{
        var doc = new jsPDF()
        const velikoSlovo = str => {
            return (
              str.charAt(0).toUpperCase() + str.slice(1).toLowerCase());
          };
          // daje sirinu i visinu stranice
          var width = doc.internal.pageSize.getWidth()
          var height=doc.internal.pageSize.getHeight()
          //naslov 
          doc.text( velikoSlovo(props.imeKolaca), width/2, 10, { align: 'center' })
          // head od tabele
          var head = [['Ime','Kolicina','Cena','Zbir','Rabat']]
          // body
          var body=[]
            data.map((item,i)=>(
                body.push([velikoSlovo(item[0]),item[2],item[3],item[4],item[5]])
           ))
           // creiranje tabele
           doc.autoTable({
            columnStyles: { 
                0 : {   fontSize:14},
                1 : {   fontSize:14},
                2:  { fontSize:14},
                3 : { fontSize:14},
                4 : { fontSize:14},
              },
              head:head,
              body: body,
              startY: 20// odakle krece tabela
             // theme: 'grid', ovde idu teme
                       })
        // vraca mesto gde se tabela zavrsava
        let krajTabele = doc.previousAutoTable.finalY;
        doc.setFontSize(14);
        // sbira cene
        const cena=data.map(item => item[4]).reduce((saberi, sab)=>saberi+sab);
        var ukupno =`Ukupno : ${cena.toFixed(2)}`;
        doc.text(ukupno, 20, krajTabele + 10)
        var msgPostupak=doc.splitTextToSize(`${postupak}`,180)
        const footer =()=>{
            if(currentpage < doc.internal.getNumberOfPages()){
              doc.setFontSize(8);
              var line =doc.line(10, height-5, 200, height-5)
              var infoIme = doc.text(`${role.infoKorisnika[0]} ${role.infoKorisnika[1]}`,width/8,height-2);
              var infoEmail=doc.text(`${role.infoKorisnika[2]}`,width/4,height-2);
              var infoAdresa =doc.text(`${role.infoKorisnika[3]}`,width/2.2,height-2);
              var infoDatum =doc.text(`datum: ${datum}`,width-45,height-2);
              var telefon=doc.text(`${role.infoKorisnika[4]}`,width-75,height-2); 
              return line,infoIme,infoEmail,infoAdresa,infoDatum,telefon
            }
          }
          var currentpage = 0;
          const strana =()=>{
            if(currentpage < doc.internal.getNumberOfPages()){
              var str="Page " + doc.internal.getNumberOfPages();
              return str
            }
          }
          footer()
          doc.text(strana(),width-15,height-7 , { align: 'center' })
         var y =krajTabele+10+20;
         for (var i = 0; i < msgPostupak.length; i++){
          if (y > 280) {
            y = 20;
            doc.addPage(); 
            footer()
            doc.text(strana(),width-15,height-7 , { align: 'center' })
        }   
            doc.setFontSize(14);
            doc.text(20, y, msgPostupak[i]);
        y = y + 10;
         }
            doc.output('dataurlnewwindow');
            doc.save(`Receptura ${props.imeKolaca}`);
    };
    
    const prikaziKalkulaciju = ()=>{   
    return(
        <div>
            {errorMessages ==='' ?

        <div className="row">
            <div className="col-sm-12 text-center"><h2>{props.imeKolaca}</h2></div>
            <br /><br />     
     <div className="btn">
      <button className="btn btn-primary btn-sm" onClick={handleOpen}>Pdf</button>
      {open ? (
         <>
           <button onClick={()=>createPdf()} className="btn btn-primary btn-sm">Receptura</button>
           <button onClick={()=>{createZaKg()}}  className="btn btn-primary btn-sm">Za kg</button>
        </>
      ) : null}
     
    </div>
           
            <div className="col-sm-12">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Ime sirovine</th>
                            <th>kolicina</th>
                            <th>Cena/kg</th>
                            <th>Cena</th>
                            <th>Rabat</th>
                           
                        </tr>
                    </thead>
                
                {data.map((items,i)=>(

                    <tbody key={i}>
                        <tr >
                            <th>{items[0]}</th>
                            <th>{items[2]}</th>
                            <th>{items[3]}</th>
                            <th>{items[4]}</th>
                            <th onClick={()=>{
                                promeniRabat(items)}}>
                                {items[5]}</th>
                            
                    
                            
                            
                        </tr>
                    </tbody>
                    
                ))}
                </table>
                
            </div>
            <div className="row">
                <div className="col-sm-4"></div>
                <div className="col-sm-4"></div>
                <div className="col-sm-4 text-center">
                    
                    <h3>Cena : {zbir}</h3>
                </div>
                
            </div>
            
            <button className="btn btn-primary btn" onClick={()=>setStranica(0)}>Back</button>
            
        </div>
             :
             <div className="alert alert-success alert-dismissible">
                <p  className="close" data-dismiss="alert" aria-label="close">&times;</p>
                    <strong>{errorMessages}</strong>
           </div>
             }
           
        </div>
    )}
    return(
       
        <div>
            {stranica === 1 ?  prikaziKalkulaciju() : null }
            {stranica === 0 ?  <Kalkulacije role={role} /> : null }
            {stranica ===2 ? <AzurirajRabat props={props}  imeKolaca={props.imeKolaca} role={role} items={items} /> : null}
        </div>
    )
}
export default DajKalkulaciju;