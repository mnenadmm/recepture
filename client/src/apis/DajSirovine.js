import  {useState, useEffect} from "react";

const DajSirovine = ()=>{
    const [data, getData] = useState(['zdravo'])
    const URL = 'http://localhost:5000/izlistaj/sirovine/react';
    console.log(data)
    useEffect(() => {
        fetchData()
    }, [])
    const fetchData = () => {
        fetch(URL)
            .then((res) =>
                res.json())
            .then((response) => { 
                getData(response);
            })
    }
    return fetchData;
    

}
export default DajSirovine;