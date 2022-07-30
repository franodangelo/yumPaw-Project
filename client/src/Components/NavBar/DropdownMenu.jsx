import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { chargeCart } from "../../redux/actions/petshopActions";
import "./DropdownMenu.css";

export default function DropdownMenu() {
  const dispatch = useDispatch();
  const { logout } = useAuth0();
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState({});
  const [isActive, setIsActive] = useState(false);
  const dropdownRef = useRef(null);

  const onClick = () => setIsActive(!isActive);

  useEffect(() => {
    if (user) {
      dispatch(chargeCart('cart'));
      axios.get("https://proyecto-grupal.herokuapp.com/owners").then(u => {
        const userDb = u.data.find(u => u.email === user.email);
        if (userDb) {
          setUserData({
            nombre: user.name,
            picture:
              userDb.profilePicture && userDb.profilePicture[0]
                ? userDb.profilePicture[0]
                : "/assets/img/notloged.png",
            email: user.email,
            pets: userDb.pets,
            address: userDb.address,
            isAdmin: userDb.isAdmin
          });
        }
      });
    }
  }, [dispatch, user]);

  useEffect(() => {
    const pageClickEvent = (e) => {
      if (
        dropdownRef.current !== null &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsActive(!isActive);
      }
    };
    if (isActive) {
      window.addEventListener("click", pageClickEvent);
    }
    return () => {
      window.removeEventListener("click", pageClickEvent);
    };
  }, [isActive]);

  return (
    <div className="menu-container">
      <div onClick={onClick} className="menu-trigger">
        <div className="picture-flex">
          {!isAuthenticated && <img src="" alt=""></img>}
          {isAuthenticated && (
            <img className="profilePicture" src={userData.picture ? userData.picture : "/assets/img/notloged.png"} alt=""></img>
          )}
        </div>
      </div>
      <nav
        ref={dropdownRef}
        className={`menu ${isActive ? "active" : "inactive"}`}
      >
        <ul>
          <li className="li-flex">
            <img src="../assets/img/person-outline.svg" alt="" className="person-outline" />
            {
              userData.isAdmin ?
                <NavLink to="/admin">Perfil Admin</NavLink>
                : <NavLink to="/mi-perfil">Perfil</NavLink>
            }
          </li>
          <li className="li-flex">
            <img src="../assets/img/person-outline.svg" alt="" className="person-outline" />
            <NavLink to="/mensajes-pendientes">Mensajes</NavLink>
          </li>
          <li className="li-flex">
            <img src="../assets/img/log-out.svg" alt="" className="log-out" />
            <button
              className="button"
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};