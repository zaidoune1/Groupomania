import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { UidContext } from "./AppContext";
import Logout from "./Log/Logout";

const Navbar = () => {
  const uid = useContext(UidContext);
    const userData = useSelector((state) => state.userReducer)


  return (
    <nav>
      <div className="nav-container">
        <div className="logo">
          <NavLink to="/home">
            <div className="logo">
              <img src="./img/icon.png" alt="icon" />
            </div>
          </NavLink>
        </div>
        {uid ? (
          <ul>
            
            <li className="welcome">

                <h5> Bienvenue {userData.pseudo}</h5>
             
            </li>
            <li className="icons-bis">
              <NavLink to="/home" className="active-left-nav">
            <img src="./img/icons/home.svg" alt="home" />
          </NavLink>
          </li>
          <li className="icons-bis">
          <NavLink to="/profil" className="active-left-nav">
            <img src="./img/icons/user.svg" alt="profil" />
          </NavLink>
          </li>
  
    
  
            <Logout />
          </ul>
        ) : (
          <ul>
            <li></li>
            <li>
              <NavLink to="/">
                <img src="./img/icons/login.svg" alt="login" />
              </NavLink>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
