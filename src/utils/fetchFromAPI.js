import axios from "axios";
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

export const fetchLeads = async () => {
  return await axios.get("/home").then((res) => {
      return res.data;
  });
}

export const loginData = async (data) => {
  return await axios.post("/login", data).then((res) => {
      return res.data;
  });
}
