import { useState } from "react";
import { NavLink, Link } from "react-router-dom";


const Navbar = () => {
  const [isExpanded, setExpanded] = useState(false);

    
    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <NavLink to='/' className="navbar-item">
              <strong>AtlasApprox</strong>
            </NavLink>
            <a 
              role="button" 
              className="navbar-burger" 
              aria-label="menu" 
              aria-expanded="false" 
              onClick={() => setExpanded(!isExpanded)}
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>

          <div className={isExpanded ? "navbar-menu is-active" : "navbar-menu"}>
            <div className="navbar-end">
              <div className="navbar-item">
                <Link to="/about" className="has-text-dark">
                  About
                </Link>
              </div>
              <div className="navbar-item">
                <Link to="https://atlasapprox.readthedocs.io/en/latest/index.html" className="has-text-dark">
                  API
                </Link>
              </div>
              <div className="navbar-item" >
                <Link to="/contact" className="has-text-dark">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </nav>
    )
}

export default Navbar;
