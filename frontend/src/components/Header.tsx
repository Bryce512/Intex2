import "../css/header.css";
import {Link} from 'react-router-dom'

function Header () {
  return (
    <>
      <div className="header">
        <h1>Intex Round 2</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><Link to="/cart">Cart</Link></li>
          </ul>
        </nav>
      </div>
      <div className="header-spacer"></div>
    </>
    

    
  )
}

export default Header;