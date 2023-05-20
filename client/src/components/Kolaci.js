import React from "react";

import { Link } from "react-router-dom";
const Kolaci = ({role})=>{
    return(
        <div className="row">
            <div className="col-sm-4">
            </div>
                <div className="col-sm-4 ">
                    <Link to='/dajKolace'>
                        <button className='btn btn-default btn-lg  btn-block'>
                            Izlistaj kolace
                        </button>
                        </Link>
                </div>
                {role.rola_1===true   ?
                <>
                <div className='row'></div>
                <br></br>
                <br></br>
                <div className='col-sm-4'></div>
                <div className='col-sm-4'>
                    <Link to='/kreirajKolac'>
                        <button className='btn btn-default btn-lg  btn-block'>
                            Kreiraj kolac /edit
                        </button>
                    </Link>

                </div>
                
                
                <div className='row'></div>
                <br></br>
                <br></br>
                <div className='col-sm-4'></div>
                
                <div className='col-sm-4'>
                    <Link to='/kalkulacije'>
                        <button  className='btn btn-primary btn-lg  btn-block'>
                            Kalkulacije
                        </button>
                    </Link>

                </div>
                 
                <div className='row'></div>
                <br></br>
                <br></br>
                <div className='col-sm-4'></div>
                <div className='col-sm-4'>
                    <Link to='/napraviRecepturu'>
                        <button className='btn btn-default btn-lg  btn-block'>
                            Kreiraj recepturu
                        </button>
                        </Link>
                </div>
                <div className='row'></div>
                <br></br>
                <br></br>
                <div className='col-sm-4'></div>
                <div className='col-sm-4'>
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