import React, {useEffect, useState, useRef} from 'react';
import Select from 'react-select';
import { DateRangePicker } from 'react-date-range';
import format from 'date-fns/format'
import { fetchLeads, fetchStatus, fetchSource, fetchAssignee, filterLeads } from "../utils/fetchFromAPI";
import {API_BASE_URL} from "../constants";

const Leads = () => {

    const refOne = useRef(null)

    const [open, setOpen] = useState(false);
    const [range, setRange] = useState([
        {
            // startDate: new Date(),
            // endDate: new Date(),
            // key: 'selection'

            startDate: "",
            endDate: "",
            key: 'selection'
        }
    ]);
    
    const [search, setSearch] = useState("");

    const [leadsData, setLeadsData] = useState([]);
    const [statusData, setStatusData] = useState([]);
    const [sourceData, setSourceData] = useState([]);
    const [assigneeData, setAssigneeData] = useState([]);


    const [selectedStatusValue, setSelectedStatusValue] = useState([]);
    const [selectedSourceValue, setSelectedSourceValue] = useState([]);
    const [selectedAssigneeValue, setSelectedAssigneeValue] = useState([]);

    const [currentPage, setCurrentPage] = useState(Number(1));
    const [paginateData,setPaginateData] = useState({});



    const fetchData = async (page) =>{
        fetchLeads(currentPage)
        .then((res) => {
            if(res.code === 200){
                setLeadsData(res.data.data);
            }
        }).catch((err) => err);
    }

    const fetchFilterData = async(page) =>{

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

    const handleSubmit = (e) =>{
        e.preventDefault();
        let postData = {
            search: search || "",
            lead_status_id: selectedStatusValue || [],
            source_id: selectedSourceValue || [],
            user_id: selectedAssigneeValue || [],
            contacted_date_from: range[0].startDate !== "" ? format(range[0].startDate, "yyyy/MM/dd") : "",
            contacted_date_to: range[0].endDate !== "" ? format(range[0].endDate, "yyyy/MM/dd") : "" 
        }

        filterLeads(postData)
        .then((res) => {
            if(res.code === 200){
                setLeadsData(res.data.data);    
            }
        }).catch((err) => err);
    }

    const handleReset = () =>{
        setSearch("");
        setSelectedStatusValue([]);
        setSelectedSourceValue([]);
        setSelectedAssigneeValue([]);
        setRange([
            {
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection'
            }
        ]);
        fetchData(1);
    }

    const handlePagination = (val) =>{
        if(currentPage < paginateData.last_page && val === 1){
            setCurrentPage( prevPage => prevPage + 1)
        }else if(currentPage > 1 && val === -1){
            setCurrentPage( prevPage => prevPage - 1)
        }
    }

    useEffect(()=>{
        fetchFilterData(1);
        document.addEventListener("click", hideOnClickOutside, true)
    },[])

    useEffect(()=>{
        fetchLeads(currentPage)
        .then((res) => {
            if(res.code === 200){
                setLeadsData(res.data.data);
                setPaginateData({
                    from: res.data.from,
                    to: res.data.to,
                    per_page: res.data.per_page,
                    last_page: res.data.last_page,
                    total: res.data.total
                })
            }
        }).catch((err) => err);
    },[currentPage])


    return (
        <>
            <div className="leads">
                <div className="container">
                    <form className="filter-toolbar" onSubmit={handleSubmit}>
                        <div className="single-filter">
                            <div className="search-input position-relative">
                                <input type="text" placeholder='Search' value={search} onChange={ (e) => setSearch(e.target.value) }/>
                                {/* <button type='submit' onSubmit={handleSearchSubmit}><i className="fa fa-search" aria-hidden="true"></i></button> */}
                                <i className="fa fa-search" aria-hidden="true"></i>
                            </div>
                        </div>
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
                                <input value={(range[0].startDate && range[0].endDate) === "" ? `${format(new Date(), "dd/MM/yyyy")} - ${format(new Date(), "dd/MM/yyyy")}` : `${format(range[0].startDate, "dd/MM/yyyy")} - ${format(range[0].endDate, "dd/MM/yyyy")}`} readOnly onClick={ () => setOpen(open => !open) }/>
                            </div>
                            <div className="date-picker-wpr" ref={refOne}>
                                {open && 
                                    <DateRangePicker className="calendarElement" staticRanges={[]} inputRanges={[]} onChange={item => setRange([item.selection])} ranges={range}/>
                                }
                            </div>
                        </div>
                        <div className="fiter-action-btns">
                            <button className='btn-primary' type='submit' onSubmit={handleSubmit}>Filter</button>
                            <button type='reset' onClick={handleReset}>Reset</button>
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
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leadsData.length > 0 ?
                                    (
                                        leadsData.slice(0,paginateData.per_page).map((lead,indx) => (
                                            <tr key={indx}>
                                                <td><input type="checkbox"/></td>
                                                <td>{lead?.name}</td>
                                                <td>{lead?.phone}</td>
                                                <td>{lead?.followup_date ?? "-"}</td>
                                                <td>{lead?.lead_notes && <p>No notes created! <span><i className="fa fa-pencil" aria-hidden="true"></i></span></p>}</td>
                                                <td className="assignees text-center">{lead.lead_assignees.map(assignee =>(
                                                    assignee?.image ? <img src={`${API_BASE_URL}/${assignee.image}`} alt={assignee.name} key={assignee.user_id}/> : null
                                                ))}</td>
                                                <td>{lead?.email}</td>
                                                <td>{lead?.country?.name}</td>
                                                <td>{lead?.lead_status?.name}</td>
                                                <td>{lead?.source?.name}</td>
                                                <td>
                                                    <div className="action-btns">
                                                        <button className='btn'><i className="fa fa-align-left" aria-hidden="true"></i></button>
                                                        <button className='btn'><i className="fa fa-pencil" aria-hidden="true"></i></button>
                                                        <button className='btn'><i className="fa fa-trash" aria-hidden="true"></i></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : 
                                    <>
                                        <tr>
                                            <td colSpan={10} className='text-center text-danger'>No Data Found!!Reset</td>
                                        </tr>
                                    </>
                                
                                }
                            </tbody>
                        </table>
                        <div className="leads-pagination-wpr">
                            <div className="data-show">
                                <button className='btn' onClick={()=>setCurrentPage(1)}>
                                    <i className="fa fa-refresh" aria-hidden="true"></i>
                                </button>
                                <div className='page-input' data-content="Page Size">
                                    <select name='page_size' defaultValue={10} onChange={(e)=> setPaginateData({...paginateData, per_page : parseInt(e.target.value) })}>
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                        <option value="50">10</option>
                                    </select>
                                    
                                </div>
                                <p>Showing {paginateData.from}-{(paginateData.from + paginateData.per_page) -1 } of {paginateData.total}</p>
                            </div>
                            <div className="data-pagination">
                                <button onClick={()=> setCurrentPage(1)} disabled={currentPage === 1}><i className="fa fa-angle-double-left" aria-hidden="true"></i></button>
                                <button onClick={()=> handlePagination(-1)} disabled={currentPage === 1}><i className="fa fa-angle-left" aria-hidden="true"></i></button>
                                <div className='page-input' data-content="Jump To">
                                    <input type="number" min="1" value={currentPage} onChange={(e)=>setCurrentPage(parseInt(e.target.value))} />
                                </div>
                                <button onClick={()=> handlePagination(1)} disabled={currentPage === 101}><i className="fa fa-angle-right" aria-hidden="true"></i></button>
                                <button onClick={()=> setCurrentPage(paginateData.last_page)} disabled={currentPage === 101}><i className="fa fa-angle-double-right" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Leads;