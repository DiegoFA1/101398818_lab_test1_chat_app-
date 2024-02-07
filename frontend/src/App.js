import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

// Nav bar
import NavBar from './components/navbar/NavBar';

// Components
import Signup from './components/user/Signup';
import Login from './components/user/Login';



// 
function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
          <Route path="/" element={ <Login /> }/>
          <Route path="/signup" element={ <Signup /> }/>

      </Routes>


    </div>
  );
}

export default App;
