import './App.css';
import 'font-awesome/css/font-awesome.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminRouter from './router/AdminRouter';
import Login from "./pages/Login";

function App() {
  
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path='/task' element={<Navigate to="/task/admin/login"/>}/>
          <Route exact path='/task/admin/login' element={<Login/>}/>
          <Route exact path='/task/admin/*' element={<AdminRouter/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
