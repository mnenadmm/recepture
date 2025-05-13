import React,{useState} from "react";
import Pocetna from "./Pocetna";
import './CreateNewAccount.css';
const CreateNewAccount=()=>{
    //document.getElementById("myBtn").disabled = true;
    const[stranica,setStranica]=useState(0)
    const[ime, setIme]=useState('')
    const[prezime, setPrezime]=useState('')
    const[userName,setUserName]=useState('');
    const[email,setEmail]=useState('');
    const[password,setPassword]=useState('')
    const[confirm,setConfirmPassword]=useState(false)
    const[telefon,setTelefon]=useState('')
    const[adresa,setAdresa]=useState('')
    const[messages,setMessages]=useState('')
    const[errorMesaggesConfirm,setErrorMesaggesConfirm]=useState('') 
    const[errorMesaggesEmail, setErrorMesaggesEmail]=useState('')
    const[errorMesaggesUser,setErrorMesaggesUser]=useState('')
    const[errorMesaggesPassword,setErrorMesaggesPassword]=useState('')
    const[irregularAdress,setIregularAdress]=useState('')//ispisuje poruku 
    const[irregularUser,setIrregularUser]=useState('')//ispisuje poruku 
    const[irregularPassword, setIrregularPassword]=useState('')
    const[irregularConfirmPassword, setIrregularConfirmPassword]=useState('')
    const[controlUser, setControlUser]=useState('')// dodeljuje id i prolsedjuje ga u css
    const[controlAdress, setControlAdress]=useState('');// dodeljuje id i prolsedjuje ga u css
    const[conrolPassword, setControlPassword]=useState('');
    const[controlConfirmPassword, setControlConfirmPassword]=useState('');
    const[simbolUser, setSimbolUser]=useState('')//dodeljuje klasu simbolima
    const[simbolEmail, setSimbolEmail]=useState('')//dodeljuje klasu simbolima
    const[simbolPassword, setSimbolPassword]=useState('');
    const[simbolConfirmPassword, setSimbolConfirmPassword]=useState('')
    const[colorSimbol, setColorSimbol]=useState('')//dodeljuje boju simbolima
    const[colorSimbolPassword, setColorSimbolPassword]=useState('');
    const[colorSimbolEmail, setColorSimbolEmail]=useState('')//dodeljuje boju simbolima
    const[colorConfirmPassword,setColorConfirmPassword]=useState('');

const kreiraj=()=>{
    
   // const adresaMonky=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; //proverava email
   const adresaMonky=/^(?=.{6,100}$)\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
                            
   const patternSpecSimbol = /^(?=.*[!@#$%^&*])/; //proverava simbole
    const patternRazmak =/^(?=.*\s)/;
    const patternVelikoSlovo=/^(?=.*[A-Z]).*$/;
    const patternBroj = /^(?=.*[0-9])/;//mora da sadrzi bar jedan broj
    const patternBrojznakova=/^.{10,16}$/;
    
    const proveraUser=(e)=>{//proverava userName  
        
        if(patternSpecSimbol.test(e)){
            setControlUser('usernameNoValid')//povezuje css sa  obavestenjem
            setSimbolUser('fas fa-exclamation-circle')//dodeljuje klasu obavestenju
            setIrregularUser('Ne sme biti simbila @!~..')//ispisuje poruku
            setColorSimbol('red')//dodeljue boju simbolu
            setUserName('')
        }else{
             setControlUser('usernameValid')
            setSimbolUser('fas fa-check-circle')
            setColorSimbol('green')
            setIrregularUser('ok')
            setUserName(e);
            } }; //proverava user
        const proveriEmail=(e)=>{ //proverava email     
            if(adresaMonky.test(e)){
                setEmail(e);
                setIregularAdress('Correct')
                setColorSimbolEmail('green')
                setSimbolEmail('fas fa-check-circle')
                setControlAdress('adresaValid');
                
            }else{
                setIregularAdress('@example.com')
                setSimbolEmail('fas fa-exclamation-circle')
                setColorSimbolEmail('red')
                setControlAdress('adresaNoValid');
            }
        };//proverava email
        const proveriPassword=(e)=>{//proverava da li e validan password validan
            // ne vracaju svi upiti TRUE 
               if(patternVelikoSlovo.test(e) && patternBroj.test(e) && !patternRazmak.test(e) && patternSpecSimbol.test(e) && patternBrojznakova.test(e)) {
                setSimbolPassword('fas fa-check-circle')
                setPassword(e);
                setIrregularPassword('Lozinka je  sigurna')
                setColorSimbolPassword('green')
                setControlPassword('passwordValid')
                 
              }else{// suprotne vrednosti ispisuju upozorenje i stilizuju crvenom bojom input
                if(!patternVelikoSlovo.test(e)){setIrregularPassword('Lozinka mora sadrzati bar jedno  veliko slovo')}
                if(!patternBroj.test(e)){setIrregularPassword('Lozinka mora sadrzati bar jedan broj')}
                if(!patternBrojznakova.test(e)){setIrregularPassword('Lozinka mora sadrzati od 10 do 16 znakova')}
                if(patternRazmak.test(e)){setIrregularPassword('Lozinka ne sme sadrzati razmak')}
                if(!patternSpecSimbol.test(e)){setIrregularPassword('Morasadrzati simbol !@#$...')}
                setColorSimbolPassword('red')
                setSimbolPassword('fas fa-exclamation-circle')
                setControlPassword('passwordNoValid');
              }

        };
        const uporediPassword=(e)=>{
            if(e === password  && password!==''){
                setConfirmPassword(true) //potvrdjuje da su pass isti
                setIrregularConfirmPassword('Passwordi se podudaraju')
                setSimbolConfirmPassword('fas fa-check-circle')
                setColorConfirmPassword('green')
                setControlConfirmPassword('passwordConfirn')
                setConfirmPassword(true)
            }else{
                setIrregularConfirmPassword('Passwordi se ne podudaraju')
                setSimbolConfirmPassword('fas fa-exclamation-circle')
                setColorConfirmPassword('red')
                setControlConfirmPassword('passwordNoConfirn')   
            }
        }
        const promeni = (e)=>{
            e.preventDefault();    
            if(confirm === true &&   email !=='' && userName!==''){
                setErrorMesaggesConfirm('') 
                setErrorMesaggesEmail('')
                setErrorMesaggesUser('')
                setErrorMesaggesPassword('')
            const opt={method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
               'ime':ime,
               'prezime': prezime, 
              'username':userName,
              'password':password,
              'email' : email,
              'adresa' : adresa,
              'telefon':telefon
            })}
                fetch('/kreirajKorisnikaReact',opt)
                .then((res) =>{
                    if(res.status===200){return res.json()}
                  
                })
                .then((response)=>{
                    if(response.errorUser){
                        setErrorMesaggesUser(response.poruka)
                        
                    }else if (response.errorEmail){
                        setErrorMesaggesEmail(response.poruka)
                    }else{
                        
                        setMessages(response.poruka)
                        setTimeout(function(){ 
                            setStranica(1) },5000);
                    }
                }).catch((error)=>{console.log('ovo je greska ',error)})
            }else if (confirm ===false){
                setErrorMesaggesConfirm('Niste potvrdili password')
            }else if(email ===''){
                    setErrorMesaggesEmail('Morate uneti email')
            }else if(userName ===''){
                 setErrorMesaggesUser('Morate uneti user name') 
            }else if(password ===''){
                setErrorMesaggesPassword('morate uneti password')
            } 
        }
    
        
        
       
        
       
   
    return(
        <div className="container">
        <div className="col-sm-12 text-center">
           <h3>Create New Account </h3> 
           {messages !=='' ? 
                <div className="alert alert-success alert-dismissible">
                    <p className="close" data-dismiss="alert" aria-label="close">&times;</p>
                        {messages}
                </div> 
                : 
            null}
        </div>
        <form onSubmit={(e)=>promeni(e)}>
        <div className="row">
                <div className="col-sm-4"></div>
                <div className="col-sm-4">
                    <br/>
                    <label  className="form-label">Ime:</label>
                    <input  className='form-control' type="text"
                        placeholder="Enter Your name" 
                        onChange={e => setIme(e.target.value)}   />  
                </div>       
            </div>
            <div className="row">
                <div className="col-sm-4"></div>
                <div className="col-sm-4">
                    <br/>
                    <label  className="form-label">Prezime:</label>
                    <input  className='form-control' type="text"
                        placeholder="Enter surname" 
                        onChange={e => setPrezime(e.target.value)}   />  
                </div>       
            </div>

            <div className="row">
                <div className="col-sm-4"></div>
                <div className="col-sm-4">
                <br/>
                    <label  className="form-label">Username:</label>
                    <input id={controlUser} className='form-control' type="text"
                        placeholder="Enter username" name="username"  
                        onChange={e => proveraUser(e.target.value)} />
                    <i className={simbolUser}    style={{color:colorSimbol}} ></i>
                    <small style={{color:colorSimbol}} >{irregularUser}</small>
                        {errorMesaggesUser !== ''? <p style={{color:'red'}}>{errorMesaggesUser}</p>  : null}
                </div>       
            </div>
            
            <div className="row">
                <div className="col-sm-4"></div>
                <div className="col-sm-4">
                    <br/>
                    <label>
                        <p>Email:</p>
                    </label>
                    <input id={controlAdress} className='form-control' type="email"
                       onChange={e => proveriEmail(e.target.value)}
                    />  
                    <i className={simbolEmail}    style={{color:colorSimbolEmail}} ></i>
                    <small style={{color:colorSimbolEmail}} >{irregularAdress}</small>
                   {errorMesaggesEmail !== ''? <p style={{color:'red'}}>{errorMesaggesEmail}</p>  : null}  
                </div>
            </div>
            <div className="row">
                <div className="col-sm-4"></div>
                <div className="col-sm-4">
                    <br/>
                    <label>
                        <p>Password:</p>
                    </label>
                    <input id={conrolPassword} className='form-control' type="password"
                       onChange={e => proveriPassword(e.target.value)} 
                    />  
                    <i className={simbolPassword}    style={{color:colorSimbolPassword}} ></i>
                    <small style={{color:colorSimbolPassword}} >{irregularPassword}</small>
                    
                    {errorMesaggesPassword !== ''? <p style={{color:'red'}}>{errorMesaggesPassword}</p>  : null}  
                </div>
            </div>
            <div className="row">
                <div className="col-sm-4"></div>
                <div className="col-sm-4">
                    <br/>
                    <label>
                        <p>Confirm Password:</p>
                    </label>
                    <input  className='form-control' name="otkljucaj" type="password" id={controlConfirmPassword} 
                        onChange={e => uporediPassword(e.target.value)} 
                     /> 
                     <i className={simbolConfirmPassword}    style={{color:colorConfirmPassword}} ></i>
                    <small style={{color:colorConfirmPassword}} >{irregularConfirmPassword}</small>

                     {errorMesaggesConfirm !== ''? <p style={{color:'red'}}>{errorMesaggesConfirm}</p>  : null} 
                </div>
            </div>
            <div className="row">
                <div className="col-sm-4"></div>
                <div className="col-sm-4">
                    <br/>
                    <label>
                        <p>Telefon:</p>
                    </label>
                    <input className='form-control' type="tel"
                        onChange={e => setTelefon(e.target.value)}
                    />  
                </div>
            </div>
            <div className="row">
                <div className="col-sm-4"></div>
                <div className="col-sm-4">
                    <br/>
                    <label>
                        <p>Adresa:</p>
                    </label>
                    <input className='form-control' type="text"
                        onChange={e => setAdresa(e.target.value)}
                    />  
                </div>
            </div>
            <br/><br />
        <div className="col-sm-12 text-center">
            <button id="myBtn" className="btn btn-primary">Save</button>
        </div>
        </form>
    </div>
        
    )
}
    return(
        <div>
            {stranica ===0 ? kreiraj() : <Pocetna />}
            </div>
    )
}
export default CreateNewAccount;