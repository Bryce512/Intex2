import "./App.css";
import AdminBooklist from "./screens/adminBooklist";
import Cart from "./screens/Cart";
import Home from "./screens/Home";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/Cart" element={<Cart />}></Route>
          <Route path="/Admin" element={<AdminBooklist />}></Route>
        </Routes>
      </Router>

    </>
  );
}

export default App;
