import "./App.css";
import AdminBooklist from "./screens/adminMovielist";
import Cart from "./screens/Cart";
import Home from "./screens/Home";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from "./screens/Login";
import AllMovies from "./screens/AllMovies";

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
          <Route path="/All" element={<AllMovies />}></Route>
        </Routes>
      </Router>

    </>
  );
}

export default App;
