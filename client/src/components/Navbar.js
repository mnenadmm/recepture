import React,{useState } from "react";
import { Link } from 'react-router-dom';

import  secureLocalStorage  from  "react-secure-storage";
import { useNavigate } from 'react-router-dom';//za preusmeravanje
import "./NavbarStyle.css"

const Navbar=({props,role})=>{
  const[state,setState]=useState({clicked:false})
  const navigate = useNavigate();

    const logout=()=>{
        //brise verifikacju iz sessije
        props.setVerifikacija(secureLocalStorage.removeItem('verifikacija'));
        // brise korisnika
        props.setKorisnik(secureLocalStorage.removeItem('korisnik'))
        //brise id korisnika
        props.setIdKorisnika(secureLocalStorage.removeItem('idKorisnika'))
        //brise rolu 1
        props.setRola_1(secureLocalStorage.removeItem('rola_1'))
        props.setRola_2(secureLocalStorage.removeItem('rola_2'))
        props.setRola_3(secureLocalStorage.removeItem('rola_3'))
        props.setInfoKorisnika(secureLocalStorage.removeItem('infoKorisnika'))
        
        const opt={method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },};
        fetch(`/logoutR`,opt)
        .then((resp)=>{ return resp.json()})
        .then((response)=>{return(
            navigate('/login'),//preusmerava napocetnu stranu
            console.log(response))})
        .catch((error)=>{console.log(error)})
    }
 
        return(
        <div>
            <nav className="NavbarItems" onClick={()=>setState(!state)}>
                <h2 className="logo">
                    React<i className="fab fa-react"></i>
                </h2>
                <div className="menu-icons"
                onClick={()=>setState(!state)}>
                <i className={state?
                'fas  fa-bars  ':'fas fa-times'}></i>
                </div>
                <ul className={state?
                "nav-menu ":"nav-menu active"}>
                    {props.verifikacija ===true &&
                    <>
                   
                    <li>
                        <Link  className="nav-links" to='/'>
                        <i className="fa-solid fa-house-user"></i>
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link  className="nav-links" to='/sirovine'>
                        <i className="fa-solid fa-circle-info"></i>
                            Sirovinee
                        </Link>
                    </li>
                    <li>
                        <Link  className="nav-links" to='/kolaci'>
                        <i className="fa-solid fa-circle-info"></i>
                            Kolaci
                        </Link>
                    </li>
                    {props.idKorisnika ===1 &&(
                    <>
                            <li>
                        <Link  className="nav-links" to='/administrator'>
                        <i className="fa-solid fa-briefcase"></i>
                            Admin
                        </Link>
                    </li>
                    </>)
                    }
                    
                    <li>
                        <p className="nav-links-mobile"  onClick={()=>logout()}>
                            Loguot
                        </p>
                    </li>
                    </>
                    }
                    

                    { props.verifikacija !==true &&
                    <>
                    <li>
                        <Link className="nav-links" to="/createAccount">Create Account</Link>
                    </li>
                    <li>
                        <Link className="nav-links" to="/login">Login</Link>
                    </li>
                    </>
                    }
                </ul>
            </nav>

        </div>
       
          
          
        )      
    }

export default Navbar;