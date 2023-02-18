import './App.css';
import 'font-awesome/css/font-awesome.css';
import { BrowserRouter as Router} from "react-router-dom";
import Routes from './router/Router';



function App() {
  return (
    <div className="App">
      <Router>
        <Routes/>
      </Router>
    </div>
  );
}

export default App;
