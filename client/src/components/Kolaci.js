import React from "react";
import { Link } from "react-router-dom";
const Kolaci = ({role})=>{
    return(
        <div className="container">
                <div className="col-sm-12 text-center">
                    <Link to='/dajKolace'>
                        <button className='btn btn-default btn-lg  btn-block'>
                            Izlistaj kolace
                        </button>
                        </Link>
                </div>
                {role.rola_1===true   ?
                <>
                <br></br>
                <br></br>
                <div className='col-sm-12 text-center'>
                    <Link to='/kreirajKolac'>
                        <button className='btn btn-default btn-lg  btn-block'>
                            Kreiraj kolac /edit
                        </button>
                    </Link>
                </div>
                <br></br>
                <br></br>
                <div className='col-sm-12 text-center'>
                    <Link to='/kalkulacije'>
                        <button  className='btn btn-primary btn-lg  btn-block'>
                            Kalkulacije
                        </button>
                    </Link>
                </div> 
                <br></br>
                <br></br>
                <div className='ccol-sm-12 text-center'>
                    <Link to='/napraviRecepturu'>
                        <button className='btn btn-default btn-lg  btn-block'>
                            Kreiraj recepturu
                        </button>
                        </Link>
                </div>
                <br></br>
                <br></br>
                <div className='col-sm-12 text-center'>
                    <Link to='/azurirajRecepturu'>
                        <button className='btn btn-default btn-lg  btn-block'>
                            Azuriraj recepturu
                        </button>
                        </Link>
                </div>
                </> 
                : null}
                <br /><br />
        </div>
    )
};
export default Kolaci;