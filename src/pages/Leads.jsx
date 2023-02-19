import React, {useEffect, useState, useRef} from 'react';
import Select from 'react-select';
import { DateRangePicker } from 'react-date-range';
import format from 'date-fns/format'
import { addDays } from 'date-fns'
import { fetchLeads, fetchStatus, fetchSource, fetchAssignee, filterLeads } from "../utils/fetchFromAPI";
import {API_BASE_URL} from "../constants";

const Leads = () => {

    const refOne = useRef(null)

    const [open, setOpen] = useState(false);
    const [range, setRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

    const [leadsData, setLeadsData] = useState([]);
    const [statusData, setStatusData] = useState([]);
    const [sourceData, setSourceData] = useState([]);
    const [assigneeData, setAssigneeData] = useState([]);


    const [selectedStatusValue, setSelectedStatusValue] = useState([]);
    const [selectedSourceValue, setSelectedSourceValue] = useState([]);
    const [selectedAssigneeValue, setSelectedAssigneeValue] = useState([]);


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
                let statusRes = (res.data);
                let modifiedstatusRes = statusRes.map(status => ({value: status.id, label: status.name}));
                setStatusData(modifiedstatusRes);
            }
        }).catch((err) => err);

        fetchSource()
        .then((res) => {
            if(res.code === 200){
                let sourceRes = (res.data);
                let modifiedsourceRes = sourceRes.map(source => ({value: source.id, label: source.name}));
                setSourceData(modifiedsourceRes)
            }
        }).catch((err) => err);

        fetchAssignee()
        .then((res) => {
            if(res.code === 200){
                let assigneeRes = (res.data);
                let modifiedassigneeRes = assigneeRes.map(source => ({value: source.user_id, label: source.name}));
                setAssigneeData(modifiedassigneeRes)
            }
        }).catch((err) => err);
    }

    const handleStatusChange = (e) => {
        setSelectedStatusValue(Array.isArray(e) ? e.map(x => x.value) : []);
    }

    const handleSourceChange = (e) => {
        setSelectedSourceValue(Array.isArray(e) ? e.map(x => x.value) : []);
    }

    const handleAssigneeChange = (e) => {
        setSelectedAssigneeValue(Array.isArray(e) ? e.map(x => x.value) : []);
    }

    const hideOnClickOutside = (e) => {
        if( refOne.current && !refOne.current.contains(e.target) ) {
            setOpen(false)
        }
    }

    const clearFilter = () =>{
        setSelectedStatusValue([]);
        setSelectedSourceValue([]);
        setSelectedAssigneeValue([]);
        setRange([
            {
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection'
            }
        ])
    }

    const submitFilter = (e) =>{
        e.preventDefault();
        let postData = {
            lead_status_id: selectedStatusValue || [],
            source_id: selectedSourceValue || [],
            user_id: selectedAssigneeValue || [],
            contacted_date_from: format(range[0].startDate, "yyyy/MM/dd") || "",
            contacted_date_to: format(range[0].endDate, "yyyy/MM/dd") || ""
        }
        
        filterLeads(postData)
        .then((res) => {
            if(res.code === 200){
                setLeadsData(res.data.data);
                clearFilter();    
            }
        }).catch((err) => err);
    }

    useEffect(()=>{
        fetchData(1);
        document.addEventListener("click", hideOnClickOutside, true)
    },[])

    return (
        <>
            <div className="leads">
                <div className="container">
                    <form className="filter-toolbar" onSubmit={submitFilter}>
                        <div className="single-filter">
                        
                            <Select className="dropdown" placeholder="Status" value={statusData.filter(obj => selectedStatusValue.includes(obj.value))}
                                options={statusData} onChange={handleStatusChange} isMulti isClearable/>

                        </div>
                        <div className="single-filter">

                            <Select className="dropdown" placeholder="Sources" value={sourceData.filter(obj => selectedSourceValue.includes(obj.value))}
                                options={sourceData} onChange={handleSourceChange} isMulti isClearable/>
                        </div>
                        <div className="single-filter">

                            <Select className="dropdown" placeholder="Assignees" value={assigneeData.filter(obj => selectedAssigneeValue.includes(obj.value))}
                                options={assigneeData} onChange={handleAssigneeChange} isMulti isClearable/>

                        </div>
                        <div className="single-filter date-filter position-relative">

                            <div className="date-input position-relative">
                                
                                <input value={`${format(range[0].startDate, "dd/MM/yyyy")} - ${format(range[0].endDate, "dd/MM/yyyy")}`} readOnly onClick={ () => setOpen(open => !open) }/>
                            </div>

                            <div className="date-picker-wpr" ref={refOne}>
                                {open && 
                                    <DateRangePicker className="calendarElement" staticRanges={[]} inputRanges={[]} onChange={item => setRange([item.selection])} ranges={range}/>
                                }
                            </div>
                        </div>
                        <div className="fiter-action-btns">
                            <button className='btn-primary' type='submit' onSubmit={submitFilter}>Filter</button>
                            <button type='reset' onClick={clearFilter}>Reset</button>
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