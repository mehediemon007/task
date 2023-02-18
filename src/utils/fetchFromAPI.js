import axios from "axios";
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');


export const loginData = async (data) => {
  return await axios.post("/login", data).then((res) => {
      return res.data;
  });
}

export const fetchLeads = async () => {
  return await axios.post("/lead/list").then((res) => {
      return res.data;
  });
}

export const fetchStatus = async () => {
  return await axios.get("/base/lead-status",).then((res) => {
      return res.data;
  });
}

export const fetchSource = async () => {
  return await axios.get("/base/source",).then((res) => {
      return res.data;
  });
}

export const fetchAssignee = async () => {
  return await axios.get("/base/assignee",).then((res) => {
      return res.data;
  });
}