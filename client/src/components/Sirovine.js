import { Link } from 'react-router-dom';
import React from "react";


const Sirovine = ({role})=>{
    
    const SirovineMenu=()=>{return(
        <div className="container">
            <br></br>
                <div className="col-sm-12 text-center">
                    <Link to='/izlistajSirovine'>
                        <button className='btn btn-primary btn-block btn-lg'>
                            IzlistajSirovine
                        </button>
                    </Link>
                </div>
                 {/*  */}
            {role.rola_1 ? <>
                <br></br>
                <br></br>
                <div className='col-sm-12 text-center'>
                    <Link to='/dodajSirovinu'>
                        <button className='btn btn-primary btn-lg  btn-block'>
                            Dodaj sirovinu
                        </button>
                    </Link>
                </div>
                </>: null}
                <br></br>
                <br></br>
                <div className='col-sm-12 text-center'>
                    <Link to='/dobavljaciEdit'>
                        <button className='btn btn-outline-secondary btn-lg   btn-block'>
                            Dobavljaci edit
                        </button>
                    </Link>
                </div>
                {role.rola_1 === true ? <>
                <br></br>
                <br></br>
                <div className='col-sm-12 text-center'>
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
                
                <div className='col-sm-12 text-center'>
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