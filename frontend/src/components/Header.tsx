import "../css/header.css";
import {Link} from 'react-router-dom'

function Header () {
  return (
    <>
      <div className="header">
        <h1>ShoeWater Bookstore</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
            <li>
              <Link to="/Admin">Admin</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="header-spacer"></div>
    </>
  );
}

export default Header;