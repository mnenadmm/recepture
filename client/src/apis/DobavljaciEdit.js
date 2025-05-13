import { useState, useEffect } from "react";
import ObrisiDobavljaca from "./ObrisiDobavljaca";
import AzurirajDobavljaca from "./AzurirajDobavljaca";
import DodajDobavljaca from "./DodajDobavljaca";

const DobavljaciEdit = ({ role }) => {
    const [errorMesagges, setErrorMesagges] = useState('');
    const [list, setList] = useState(0);
    const [data, setData] = useState([]);
    const [idDobavljaca, setIdDobavljaca] = useState(0);
    const [imeDobavljaca, setImeDobavljaca] = useState('');
    const [telefon, setTelefon] = useState('');
    const [email, setEmail] = useState('');
    const [adresa, setAdresa] = useState('');

    useEffect(() => {
        fetch('/dajDobavljaceReact', {
            method: "GET",
            headers: {}
        })
            .then((res) => {
                if (res.status === 200) return res.json();
            })
            .then((response) => {
                if (response?.error) {
                    return setErrorMesagges(response.poruka);
                }
                setData(response);
            })
            .catch(error => {
                console.log('ovo je greska ', error);
                setErrorMesagges('Neuspela konekcija sa bazom, proverite internet konekciju');
            });
    }, []);

    const prikaziDobavljaca = () => (
        <div className="container">
            <div className="d-flex flex-wrap gap-2 mb-3">
                <button className="btn btn-secondary" onClick={() => setList(0)}>Lista</button>
                {role.rola_1 === true && (
                    <>
                        <button className="btn btn-warning" onClick={() => setList(3)}>Ažuriraj</button>
                        <button className="btn btn-danger" onClick={() => setList(4)}>Obriši</button>
                    </>
                )}
            </div>

            <div>
                <button onClick={() => setList(0)} className="btn btn-primary">Nazad</button>
            </div>

            <div className="text-center my-4">
                <h1>{imeDobavljaca}</h1>
            </div>

            <div className="row justify-content-center mb-3">
                <div className="col-sm-6 col-md-4">
                    <label>Id</label>
                    <input className="form-control" value={idDobavljaca} disabled />
                </div>
            </div>
            <div className="row justify-content-center mb-3">
                <div className="col-sm-6 col-md-4">
                    <label>Telefon</label>
                    <input className="form-control" value={telefon} disabled />
                </div>
            </div>
            <div className="row justify-content-center mb-3">
                <div className="col-sm-6 col-md-4">
                    <label>Email</label>
                    <input className="form-control" value={email} disabled />
                </div>
            </div>
            <div className="row justify-content-center mb-5">
                <div className="col-sm-6 col-md-4">
                    <label>Adresa</label>
                    <input className="form-control" value={adresa} disabled />
                </div>
            </div>
        </div>
    );

    const dajDobavljaca = (event) => {
        setIdDobavljaca(event[0]);
        setImeDobavljaca(event[1]);
        setTelefon(event[2]);
        setEmail(event[3]);
        setAdresa(event[4]);
        setList(2);
    };

    const dobavljaci = () => (
        <div className="container">
            <div className="d-flex flex-wrap gap-2 mb-4">
                <button className="btn btn-secondary">Lista</button>
                {(role.rola_1 === true || role.rola_2 === true) && (
                    <button className="btn btn-success" onClick={() => setList(1)}>Kreiraj</button>
                )}
            </div>

            <div className="row justify-content-center">
                <div className="col-sm-8 col-md-6">
                    {data.map((item, i) => (
                        <p key={i}>
                            <button
                                type="button"
                                onClick={() => dajDobavljaca(item)}
                                className="btn btn-outline-dark btn-block mb-2"
                            >
                                {item[1]}
                            </button>
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="container mt-4">
            {errorMesagges === '' ? (
                <>
                    {list === 0 && dobavljaci()}
                    {list === 1 && <DodajDobavljaca role={role} />}
                    {list === 2 && prikaziDobavljaca()}
                    {list === 3 && <AzurirajDobavljaca role={role} props={{ idDobavljaca, imeDobavljaca, telefon, email, adresa }} />}
                    {list === 4 && <ObrisiDobavljaca role={role} props={{ idDobavljaca, imeDobavljaca, adresa }} />}
                </>
            ) : (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>{errorMesagges}</strong>
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default DobavljaciEdit;
