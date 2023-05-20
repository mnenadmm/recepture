import { Link } from 'react-router-dom';
import React from "react";


const Sirovine = ({role})=>{
    
    const SirovineMenu=()=>{return(
        <div className="container">
       
            <div className='row'></div>
            <br></br>
            <div className="col-sm-4">
            </div>
                <div className="col-sm-4 ">
                    <Link to='/izlistajSirovine'>
                        <button className='btn btn-default btn-lg  btn-block'>
                            IzlistajSirovine
                        </button>
                    </Link>
                </div>
                 {/*  */}
            {role.rola_1 ? <>
                <div className='row'></div>
                <br></br>
                <br></br>
                <div className='col-sm-4'></div>
                <div className='col-sm-4'>
                    <Link to='/dodajSirovinu'>
                        <button className='btn btn-default btn-lg  btn-block'>
                            Dodaj sirovinu
                        </button>
                    </Link>

                </div>
                </>: null}
                <div className='row'></div>
                <br></br>
                <br></br>
                <div className='col-sm-4'></div>
                <div className='col-sm-4'>
                    <Link to='/dobavljaciEdit'>
                        <button className='btn btn-default btn-lg  btn-block'>
                            Dobavljaci edit
                        </button>
                    </Link>

                </div>
                {role.rola_1 === true ? <>
                <div className='row'></div>
                <br></br>
                <br></br>
                <div className='col-sm-4'></div>
                <div className='col-sm-4'>
                    <Link to='/sirovineEdit'>
                        <button className='btn btn-default btn-lg  btn-block'>
                            Sirovine edit
                        </button>
                    </Link>
                </div>
                </>:null}
                <div className='row'></div>
                <br></br>
                <br></br>
                <div className='col-sm-4'></div>
                <div className='col-sm-4'>
                    <Link to='/naruciSirovine'>
                    <button className='btn btn-default btn-lg  btn-block'>
                        Naruci sirovine
                    </button>
                    </Link>
                </div>
                
            
            <br /><br />
        </div>
    );}
    
        return(
            <div>
                {SirovineMenu()}
            </div>
        )
};

export default Sirovine;