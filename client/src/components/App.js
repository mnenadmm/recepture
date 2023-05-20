import React, { useState} from "react";
import { CartProvider } from "react-use-cart";
import Sirovine from "./Sirovine";
import Pocetna from "./Pocetna";
import Kolaci from "./Kolaci";
import IzlistajSirovine from './IzlistajSirovine';
import DodajSirovinu from "./DodajSirovinu";
import SirovineEdit from "./SirovineEdit";
import NaruciSirovine from "../apis/NaruciSirovine";
import Kalkulacije from "./Kalkulacije";
import Header from "./Header";
import {
    BrowserRouter,
    Routes,
    Route  
  } from "react-router-dom";
import DajKolace from "../apis/DajKolace";
import KreirajKolac from "../apis/KreirajKolac";
import DobavljaciEdit from "../apis/DobavljaciEdit";
import NapraviRecepturu from "../apis/NapraviRecepturu";
import AzurirajRecepturu from "../apis/AzurirajRecepturu";

import Login from "./Login";
import Administrator from "./Administrator";
import CreateNewAccount from "./CreateNewAccount";
import  secureLocalStorage  from  "react-secure-storage";//zakljucava sessioje u browsveru
import ChangePassword from "./ChnagePassword";
import VerifikujNalog from "./VerifikujNalog";


const App = () =>{
  // dodeljuje da je nalog verifikovan
  const[verifikacija, setVerifikacija]=useState(secureLocalStorage.getItem('verifikacija'))
  //dodeljuje staitu id korisnika
  const[idKorisnika, setIdKorisnika]=useState(secureLocalStorage.getItem('idKorisnika'))
  //dodeljuje ime korisniku
  const[korisnik,setKorisnik]=useState(secureLocalStorage.getItem('korisnik'))
  // dodeljuje rolu 1 rolu 2 rolu 3
  const[rola_1,setRola_1]=useState(secureLocalStorage.getItem('rola_1'));
  const[rola_2,setRola_2]=useState(secureLocalStorage.getItem('rola_2'));
  const[rola_3,setRola_3]=useState(secureLocalStorage.getItem('rola_3'));
  console.log(rola_1)
    return(
      <div  className="container">
        
        <CartProvider>
          <BrowserRouter >
            <Header role={{rola_1,rola_2,rola_3}}    props={{verifikacija,setVerifikacija,idKorisnika,korisnik,setKorisnik,setIdKorisnika,setRola_1,setRola_2,setRola_3}} />
          <Routes>
            <Route path="/" element={<Pocetna />}/>
            <Route path="/createAccount" element={<CreateNewAccount />}></Route>

            <Route path="/login" element={<Login props={{setVerifikacija,setIdKorisnika,setKorisnik,setRola_1,setRola_2,setRola_3}} />}></Route>
            <Route path="/ChangePassword" element={<ChangePassword />}></Route>
            <Route path="/verifikujNalog" element={<VerifikujNalog />}></Route> 
          </Routes>        
        
        <Routes> 
          <Route path="/" element={<Pocetna/>}/>
          <Route path="/sirovine" element={<Sirovine role={{rola_1,rola_2,rola_3,idKorisnika}} />} />
          <Route path="/kolaci" element={<Kolaci role={{rola_1,rola_2,rola_3,idKorisnika}} />} />
          <Route path="/izlistajSirovine" element={<IzlistajSirovine role={{rola_1,rola_2,rola_3}}  props={{idKorisnika}} />}></Route>
          <Route path="/dodajSirovinu" element={<DodajSirovinu role={{rola_1,rola_2,rola_3}} props={{idKorisnika}} />}></Route>
          <Route path="/sirovineEdit" element={<SirovineEdit role={{rola_1,rola_2,rola_3}} props={{idKorisnika}} />}></Route>
          <Route path="/naruciSirovine" element={<NaruciSirovine role={{rola_1,rola_2,rola_3,idKorisnika}}  />}></Route>
          <Route path="/dajKolace" element={<DajKolace role={{rola_1,rola_2,rola_3,idKorisnika}} />}></Route>
          <Route path="/kreirajKolac" element={<KreirajKolac role={{rola_1,rola_2,rola_3,idKorisnika}}  />}></Route>
          <Route path="/dobavljaciEdit"  element={<DobavljaciEdit role={{rola_1,rola_2,rola_3,idKorisnika}} />}></Route>
          <Route path="/napraviRecepturu" element={<NapraviRecepturu role={{rola_1,rola_2,rola_3,idKorisnika}} />}></Route>
          <Route path="/azurirajRecepturu" element={<AzurirajRecepturu role={{rola_1,rola_2,rola_3,idKorisnika}} />}></Route>
          <Route path="/kalkulacije" element={<Kalkulacije role={{rola_1,rola_2,rola_3,idKorisnika}}  />}></Route>
          <Route path="/administrator" element={<Administrator props={{idKorisnika}} role={{rola_1,rola_2,rola_3,idKorisnika}} /> }></Route>
        </Routes> 
    </BrowserRouter>
    
    
   
    </CartProvider>
    
    
    </div>
    )
};

export default App;