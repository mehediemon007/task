import React, {useEffect, useState} from 'react';
import { fetchLeads } from "../utils/fetchFromAPI";
import {API_BASE_URL} from "../constants";

const Leads = () => {

    const [leadsData, setleadsData] = useState([])

    const fetchData = async (page) =>{
        fetchLeads()
        .then((res) => {
            if(res.code === 200){
                setleadsData(res.data.data);
            }
        }).catch((err) => err);
    }

    useEffect(()=>{
        fetchData(1);
    },[])

    return (
        <>
            <div className="leads">
                <div className="container">
                    <div className="filter-toolbar">
                        <div className="single-filter">
                            <select name="status" id="status">
                                <option value="1">1</option>
                                <option value="1">1</option>
                                <option value="1">1</option>
                                <option value="1">1</option>
                                <option value="1">1</option>
                            </select>
                        </div>
                        <div className="single-filter">
                            <select name="sources" id="sources">
                                <option value="1">21</option>
                                <option value="1">12</option>
                                <option value="1">221</option>
                                <option value="1">12</option>
                                <option value="1">21</option>
                            </select>
                        </div>
                        <div className="single-filter">
                            <select name="assignees" id="assignees">
                                <option value="1">1</option>
                                <option value="1">1</option>
                                <option value="1">1</option>
                                <option value="1">1</option>
                                <option value="1">1</option>
                            </select>
                        </div>
                        <div className="single-filter">
                            <select name="status" id="status">
                                <option value="1">1</option>
                                <option value="1">1</option>
                                <option value="1">1</option>
                                <option value="1">1</option>
                                <option value="1">1</option>
                            </select>
                        </div>
                        <div className="fiter-action-btns">
                            <button>Filter</button>
                            <button>Reset</button>
                        </div>
                    </div>
                    <div className="leads-table-wpr">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>
                                        <input type="checkbox"/>
                                    </th>
                                    <th>Lead name</th>
                                    <th>Phone</th>
                                    <th>Follwup Date</th>
                                    <th>Last note</th>
                                    <th>Assigned</th>
                                    <th>Email</th>
                                    <th>Preferred Countries</th>
                                    <th>Status</th>
                                    <th>Source</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leadsData.map(lead => (
                                    <tr key={lead.id}>
                                        <td><input type="checkbox"/></td>
                                        <td>{lead.name}</td>
                                        <td>{lead.phone}</td>
                                        <td>{lead.followup_date ?? "-"}</td>
                                        <td>{lead.lead_notes && <p>No notes created! <span><i className="fa fa-pencil" aria-hidden="true"></i></span></p>}</td>
                                        <td className="assignees text-center">{lead.lead_assignees.map(assigne =>(
                                            <img src={`${API_BASE_URL}/${assigne.image}`} alt={assigne.name} key={assigne.user_id}/>
                                        ))}</td>
                                        <td>{lead.email}</td>
                                        <td>{lead.country.name}</td>
                                        <td>{lead.lead_status.name}</td>
                                        <td>{lead.source.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Leads;