import React, { useState, useEffect } from "react";
import AdminKorisnici from "./AdminKorisnici";
import AzurirajKorisnika from "./AzurirajKorisnika";
import BezVerifikacije from "./BezVerifikacije";

const Administrator = ({ props, role }) => {
    const [stranica, setStranica] = useState(0)
    const [errorMesagges, setErrorMesagges] = useState('')
    const [data, getData] = useState([])
    const [blockUser, setBlockUser] = useState([])
    const [noVerification, setNoVerification] = useState([])
    useEffect(() => {
        fetch('/administrator', {
            method: "GET",
            headers: {
            }
        })
            .then((res) => {
                if (res.status === 200) { return res.json() }
            })
            .then((response) => {
               if(response[0].error){return setErrorMesagges(response[0].poruka)
               }else if(response[1].error){return setErrorMesagges(response[1].poruka)
               }else if(response[2].error){return setErrorMesagges(response[2].poruka)
               }else{
                    getData(response[0]);
                    setBlockUser(response[1]);
                    setNoVerification(response[2]);
               }
                
            })
            .catch(error => {
                console.log('ERROR: ', error)
            })
    }, [])
    const PocetnaAdmin = () => {
        return (
            <div className="container">
                {errorMesagges === '' ? <>
                <div className="row">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                        <button onClick={() => setStranica(2)} className='btn btn-default btn-lg  btn-block'>
                            Korisnici
                        </button>
                    </div>
                </div><br />
                <div className="row">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                        <button onClick={() => setStranica(3)} className='btn btn-default btn-lg  btn-block'>
                            Korisnici bez verifikacije
                        </button>
                    </div>
                </div><br />
                </> : 
                    <div className="alert alert-success alert-dismissible">
                    <p className="close" data-dismiss="alert" aria-label="close">&times;</p>
                    <strong>{errorMesagges}</strong>
                </div>
                }

            </div>
        )
    }

    return (
        <div>
            {stranica === 0 ? PocetnaAdmin() : null}
            {stranica === 2 ? <AdminKorisnici func={{ data, errorMesagges }} props={props} /> : null}
            {stranica === 1 ? <AzurirajKorisnika props={props} azuriraj={role} /> : null}
            {stranica === 3 ? <BezVerifikacije func={{ blockUser, errorMesagges, noVerification }} props={props} /> : null}
            
        </div>
    )
}
export default Administrator;
