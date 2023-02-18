import React, {useEffect, useState} from 'react';
import { fetchLeads } from "../utils/fetchFromAPI";

const Leads = () => {

    const [leadsData, setleadsData] = useState("")

    const fetchData = () =>{
        fetchLeads()
        .then((res) => {
            if(res.code === 200){
                setleadsData(res.data.data);
            }
        }).catch((err) => err);
    }

    useEffect(()=>{
        fetchData();
    },[])

    console.log(leadsData)

    return (
        <>
            <h1>jhsl</h1>
        </>
    )
}

export default Leads;