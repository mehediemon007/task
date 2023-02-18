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
          <Route exact path='/' element={<Navigate to="/login"/>}/>
          <Route exact path='/login' element={<Login/>}/>
          <Route exact path='/admin/*' element={<AdminRouter/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
