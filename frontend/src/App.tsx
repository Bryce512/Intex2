<<<<<<< HEAD
import './App.css';
import AdminBooklist from './screens/adminBooklist';
import Cart from './screens/Cart';
import Home from './screens/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './screens/Login';
import Privacy from './screens/Privacy';
=======
import "./App.css";
import AdminBooklist from "./screens/adminBooklist";
import Cart from "./screens/Cart";
import Home from "./screens/Home";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from "./screens/Login";
import AllMovies from "./screens/AllMovies";
>>>>>>> 589b072b16de530d3e598d6ac01e76afd3cdc60e

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/Home" element={<Home />}></Route>
          <Route path="/Login" element={<Login />}></Route>
          <Route path="/Cart" element={<Cart />}></Route>
          <Route path="/Admin" element={<AdminBooklist />}></Route>
<<<<<<< HEAD
          <Route path="Privacy" element={<Privacy />}></Route>
=======
          <Route path="/All" element={<AllMovies />}></Route>
>>>>>>> 589b072b16de530d3e598d6ac01e76afd3cdc60e
        </Routes>
      </Router>
    </>
  );
}

export default App;
