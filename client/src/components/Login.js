import React, { useState } from 'react';
import  secureLocalStorage  from  "react-secure-storage";
import { useNavigate } from 'react-router-dom';
import PromeniPassword from './PromeniPassword';

const Login=({props})=>{
  const[stranica, setStranica]=useState(0)
  const[errorMesagges,setErrorMesagges]=useState('');
   const [username, setUserName] = useState();
   const [password, setPassword] = useState();
    const navigate = useNavigate();
  
  const UlogujSe=()=>{
    
    const promeni=(e)=>{
        e.preventDefault();
        
        var patternRazmak =/^(?=.*\s)/;
        var patternVelikoSlovo=/^(?=.*[A-Z]).*$/;
        const patternBroj = /^(?=.*[0-9])/;
        const patternBrojznakova=/^.{10,16}$/;
        if(!patternVelikoSlovo.test(password) || patternRazmak.test(password) || !patternBroj.test(password) || !patternBrojznakova.test(password)){
          if(patternRazmak.test(password)){setErrorMesagges('Uneli ste pogresno korisnicko ime ili lozinku  ')}
          if(!patternVelikoSlovo.test(password)){setErrorMesagges('Uneli ste pogresno korisnicko ime ili lozinku  ')}
          if(!patternBroj.test(password)){setErrorMesagges('Uneli ste pogresno korisnicko ime ili lozinku  ')}
          if(!patternBrojznakova.test(password)){setErrorMesagges('Uneli ste pogresno korisnicko ime ili lozinku  ')}
        }else{
          setErrorMesagges('');
          const opt={method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'username':username,
          'password':password
        })}
        fetch('/login',opt) // dodao sam proxy i package.json
        .then(resp =>{ 
            if(resp.status===200){ return resp.json()}
        }) 
        .then(response=>{
          if(response){
            if(response.error){return setErrorMesagges(response.poruka) }
            else{
              //dodeljuje da je nalog verifikovan
            secureLocalStorage.setItem('verifikacija',response.prijava) 
            props.setVerifikacija(secureLocalStorage.getItem('verifikacija'))
            //dodeljuje id korisnika
            secureLocalStorage.setItem('idKorisnika',response.idKorisnika)//id korisnika
            props.setIdKorisnika(secureLocalStorage.getItem('idKorisnika'))
            //ime korisnika
            secureLocalStorage.setItem('korisnik',response.username)
            props.setKorisnik(secureLocalStorage.getItem('korisnik'))
            // dodeljuje rolu 1
            secureLocalStorage.setItem('rola_1',response.rola_1)
            props.setRola_1(secureLocalStorage.getItem('rola_1')) 
            // dodeljuje rolu 2
            secureLocalStorage.setItem('rola_2',response.rola_2)
            props.setRola_2(secureLocalStorage.getItem('rola_2')) 
            // dodeljuje rolu 3
            secureLocalStorage.setItem('rola_3',response.rola_3)
            props.setRola_3(secureLocalStorage.getItem('rola_3')) 
            //informacije o korisniku ime,prezime email i adresa
            secureLocalStorage.setItem('infoKorisnika',response.infoKorisnika)
            props.setInfoKorisnika(secureLocalStorage.getItem('infoKorisnika'))
            
            navigate('/');//preusmerava napocetnu stranu
            }
          }  
        })
        .catch(error=>{
          console.log('ovo je greska ',error )
      })
        } 
    }
  return(
    <div className="container">
      <div className='col-sm-12 text-center'>
        <h1>Please Log In</h1>
        <br />
          <p style={{color: 'red'}}>{errorMesagges}</p>
        <br />
      </div>
      
      <form onSubmit={(e)=>promeni(e)}>
      
        <div className='row'>
          <div className='col-sm-4'></div>
          <div className='col-sm-4'>
            <label>
              <p>Username</p>
              <input  className='form-control' type="text" onChange={e => setUserName(e.target.value)} />
            </label>
            </div>
        </div>
        <div className='row'>
          <div className='col-sm-4'></div>
          <div className='col-sm-4'>
            <label>
              <p>Password</p>
              <input className='form-control' type="password" onChange={e => setPassword(e.target.value)} />
              
            </label>
            <p onClick={()=>setStranica(1)}>Forgot password???</p>
          </div>
        </div>
        <br />
        <br /><br />
        <div className='col-sm-12 text-center'>
          <button className='btn btn-primary' onClick={(e)=>promeni(e)}type="submit">Submit</button>
        </div>
      </form>
     
    </div>
  )
    }
    
    
    return(
      <div>
        
       
        {stranica===0? UlogujSe() : null}
        {stranica ===1 ? <PromeniPassword /> : null}
      
        
        
  
      </div>
    )
}

export default Login; 