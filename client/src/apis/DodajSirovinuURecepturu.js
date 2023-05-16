import AzurirajRecepturuDodajSirovinu from "./AzurirajRecepturuDodajSirovinu";


const DodajSirovinuURecepturu=({props,token,role})=>{
   
    const stranica =3;
    const idKolaca=props.idKolaca;
    const imeKolaca=props.imeKolaca;
    
    const dodaj=()=>{
        
    return(
        <div>
            {<AzurirajRecepturuDodajSirovinu role={role} token={token} props={{idKolaca,imeKolaca}} />}
        </div>
    )}
    return(
        <div>
            {stranica ===3 ? dodaj() : null}
            
            
        </div>
    )
}
export default DodajSirovinuURecepturu;