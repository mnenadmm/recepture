import React from "react";
import { Link } from "react-router-dom";

const Kolaci = ({ role }) => {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="w-100" style={{ maxWidth: '500px' }}>
                <div className="mb-3 text-center">
                    <Link to='/dajKolace'>
                        <button className='btn btn-default btn-lg btn-block'>
                            Izlistaj kolace
                        </button>
                    </Link>
                </div>

                {role.rola_1 === true && (
                    <>
                        <div className="mb-3 text-center">
                            <Link to='/kreirajKolac'>
                                <button className='btn btn-default btn-lg btn-block'>
                                    Kreiraj kolac / edit
                                </button>
                            </Link>
                        </div>

                        <div className="mb-3 text-center">
                            <Link to='/kalkulacije'>
                                <button className='btn btn-primary btn-lg btn-block'>
                                    Kalkulacije
                                </button>
                            </Link>
                        </div>

                        <div className="mb-3 text-center">
                            <Link to='/napraviRecepturu'>
                                <button className='btn btn-default btn-lg btn-block'>
                                    Kreiraj recepturu
                                </button>
                            </Link>
                        </div>

                        <div className="mb-3 text-center">
                            <Link to='/azurirajRecepturu'>
                                <button className='btn btn-default btn-lg btn-block'>
                                    Azuriraj recepturu
                                </button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Kolaci;
