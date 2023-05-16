import React,{useState} from "react";
import KalendarKorisnik from "./KalendarKorisnik";

const PlanerAdmin=({props,data,korisnik,vreme})=>{
    const[stranica, setStranica]=useState(7)
    const[boja, setBoja]=useState('')
    const[text,setText]=useState('')
    const DajPlaner=()=>{
        const sacuvaj=()=>{
            
            fetch('http://localhost:5000/AdminDodajPodsetnik', {
            method: 'POST',
				headers: {
                    Authorization: 'Bearer ' +props.token,
                    IdKorisnika:  props.user,
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ //moramo poslati u JSON formatu
					idKorisnika: props.user,
                    datum: vreme.datum,
                    mesec: vreme.mesec,
                    godina: vreme.godina,
                    text: text,
                    boja: boja,
                    komercijalista: korisnik.idKorisnika,
                    imeKomercijaliste: korisnik.imeKorisnika

				})
			})
            .then((res)=>{
                if(res.status===200){return res.json()}
                if(res.status!==200){return console.log('Nije 200')}
                
            }).then((response)=>{
                console.log(response)
            }).catch((error)=>{return console.log('Ovo je greska ',error)});
            setInterval(() => {
                setStranica(6) 
             }, 3000);
        }
        
        return(
            <div className="container">
                <br />
                <div className="row">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                        <label>Korisnik:</label>
                        <input className="form-control"
                        defaultValue={korisnik.imeKorisnika}
                        disabled />
                    </div>    
                </div><br />
                <div className="row">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                        <label>Datum</label>
                        <input className="form-control"
                         defaultValue={vreme.datum+" / "+vreme.mesec+" / "+vreme.godina}
                         disabled  />
                    </div>
                </div>
                <br /><br />
                <div className="row">
                    <div className="col-sm-2"></div>
                    <div className="col-sm-8">
                        <label>Text</label>
                        <textarea rows="5" cols="50" className="form-control"
                            onChange={e => setText(e.target.value)}
                        ></textarea>
                    </div>
                </div>
                <br /><br />
                <div className="row">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                        <select className="form-control" onChange={(e)=>setBoja(e.target.value)}>
                            <option>Izaberite boju...</option>
                            <option style={{color: "red"}} value="red">Crvena</option>
                            <option style={{color: "blue"}} value="blue">Plava</option>
                            <option style={{color: "green"}} value="green">Zelena</option>
                            

                        </select>
                    </div>
                </div>
                <br /><br />
                <div className="row">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4 text-center">
                        <button className="btn btn-succses"
                            onClick={()=>sacuvaj()}
                        >Save</button>
                    </div>
                </div>
                <button onClick={()=>setStranica(6)}>back</button>
            </div>
        )
    }
    return(
        <div>
            {stranica=== 7? DajPlaner() : null}
            {stranica === 6 ? <KalendarKorisnik props={props} data={data} korisnik={korisnik}  /> : null}
        </div>
    )
}
export default PlanerAdmin;