import './App.css';
import AdminBooklist from './screens/adminBooklist';
import Cart from './screens/Cart';
import Home from './screens/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './screens/Login';
import Privacy from './screens/Privacy';

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
          <Route path="Privacy" element={<Privacy />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
