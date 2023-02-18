import React, {useEffect, useState} from 'react';
import { fetchLeads, fetchStatus, fetchSource, fetchAssignee, filterLeads } from "../utils/fetchFromAPI";
import {API_BASE_URL} from "../constants";

const Leads = () => {

    const [leadsData, setLeadsData] = useState([]);
    const [statusData, setStatusData] = useState([]);
    const [sourceData, setSourceData] = useState([]);
    const [assigneeData, setAssigneeData] = useState([]);

    const [filterValues, setfilterValues] = useState({
        statuses:[],
        sources:[],
        assignees:[]
    })

    const fetchData = async (page) =>{
        fetchLeads()
        .then((res) => {
            if(res.code === 200){
                setLeadsData(res.data.data);
            }
        }).catch((err) => err);

        fetchStatus()
        .then((res) => {
            if(res.code === 200){
                setStatusData(res.data)
            }
        }).catch((err) => err);

        fetchSource()
        .then((res) => {
            if(res.code === 200){
                setSourceData(res.data)
            }
        }).catch((err) => err);

        fetchAssignee()
        .then((res) => {
            if(res.code === 200){
                setAssigneeData(res.data)
            }
        }).catch((err) => err);
    }

    const handleFilter = (e) =>{
        setfilterValues({
            ...filterValues,
            [e.target.name] : [...filterValues[e.target.name], e.target.value]
        });
    }

    const submitFilter = (e) =>{
        e.preventDefault();
        filterLeads(filterValues)
        .then((res) => {
            if(res.code === 200){
                console.log(res.data)
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
                    <form className="filter-toolbar" onSubmit={submitFilter}>
                        <div className="single-filter">
                            <select name="statuses" id="status" defaultValue={"default"} onChange={handleFilter}>
                                <option value="default" hidden>Statues</option>
                                {statusData.map(status => (
                                    <option value={status.id} key={status.id}>{status.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="single-filter">
                            <select name="sources" id="sources" defaultValue={"default"} onChange={handleFilter}>
                                <option value="default" hidden>Sources</option>
                                {sourceData.map(source => (
                                    <option value={source.id} key={source.id}>{source.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="single-filter">
                            <select name="assignees" id="assignees" defaultValue={"default"} onChange={handleFilter}>
                                <option value="default" hidden>Assignees</option>
                                {assigneeData.map(assignee => (
                                    <option value={assignee.user_id} key={assignee.user_id}>{assignee.name}</option>
                                ))}
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
                            <button className='btn-primary' type='submit' onSubmit={submitFilter}>Filter</button>
                            <button>Reset</button>
                        </div>
                    </form>
                    <div className="leads-table-wpr">
                        <table className="table table-responsive">
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