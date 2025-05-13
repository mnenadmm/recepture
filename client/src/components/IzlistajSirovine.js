import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import Select from "./Select";

function IzlistajSirovine({ props, role }) {
    const [originalData, setOriginalData] = useState([]);  // Drži celu listu sirovina
    const [filteredData, setFilteredData] = useState([]);  // Drži filtrirane podatke
    const [errorMessages, setErrorMessages] = useState('');
    const [showSelect, setShowSelect] = useState(0); // Prikazivanje Select-a
    const URL_Dobavljac = '/dajImeDobavljacaIdReact';
    const navigate = useNavigate();  // Inicijalizacija navigate  // Kreiranje istorije za navigaciju

    // Učitavanje podataka
    useEffect(() => {
        fetch('/izlistaj/sirovine/react', { method: "GET", headers: {} })
            .then((res) => { if (res.status === 200) { return res.json(); } })
            .then((response) => {
                if (response.error) {
                    console.log(response);
                    return setErrorMessages(response.poruka);
                }
                setOriginalData(response); // Sačuvaj celu listu
                setFilteredData(response);  // Početno filtriranje (bez pretrage)
                setShowSelect(1); // Prikazivanje Select-a
            })
            .catch(error => { console.log('ovo je greška ', error); });
    }, []);

    // Filtriranje podataka
    const handleSearch = (event) => {
        let value = event.target.value.toLowerCase();
        let result = originalData.filter((item) => {
            const naziv = item[1] ? String(item[1]).toLowerCase() : '';
            return naziv.includes(value); // Filtriranje po nazivu
        });
        setFilteredData(result);  // Ažuriraj filtrirane podatke
    };

    // Promena dobavljača
    const promena = (id) => {
        if (id > 0) {
            fetch(`/sirovinePoDobavljacuReact/${id}`, { method: "GET" })
                .then((res) => { if (res.status === 200) { return res.json(); } })
                .then((response) => {
                    if (response.error) {
                        return setErrorMessages(response.poruka);
                    } else {
                        setFilteredData(response); // Ažuriraj filtrirane podatke prema dobavljaču
                    }
                })
                .catch(error => { console.log('ovo je greška ', error); });
        } else {
            setFilteredData(originalData); // Ako nema odabranog dobavljača, vrati sve podatke
        }
    };

 

    // Lista proizvoda
    const lista = () => {
        return (
            <div className="container">
                {errorMessages === '' ? (
                    <>
                        {showSelect === 1 ? (
                            <Select
                                role={role}
                                promena={promena}
                                options={URL_Dobavljac}
                                setErrorMessages={setErrorMessages}
                                ime="Izlistaj po Dobavljacu..."
                            />
                        ) : null}

                        <br />
                        <div>
                            <input
                                className="form-control"
                                placeholder="Search"
                                onChange={handleSearch} // Filtriraj po imenu
                            />
                        </div>

                        {filteredData.length > 0 ? (
                            <table className="table table-hover">
                                <tbody>
                                    <tr>
                                        <th>Ime</th>
                                        <th>Cena</th>
                                        <th>Proizvodjac</th>
                                    </tr>
                                    {filteredData.map((item, i) => (
                                        <tr key={i}>
                                            <td>{item[1]}</td>
                                            <td>{item[2]}</td>
                                            <td>{item[3]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="alert alert-warning mt-3">
                                Nema sirovina od ovog dobavljača
                            </div>
                        )}
                        <br />
                        {/* Dodaj dugme za povratak */}
                        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                            Back
                        </button>

                    </>
                ) : (
                    <div className="alert alert-success alert-dismissible">
                        <p
                            className="close"
                            data-dismiss="alert"
                            aria-label="close"
                        >
                            &times;
                        </p>
                        <strong>{errorMessages}</strong>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div>
            {lista()}
        </div>
    );
}

export default IzlistajSirovine;
