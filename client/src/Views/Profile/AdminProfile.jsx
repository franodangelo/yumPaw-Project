import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import NavBarShop from "../../Components/NavBar/NavBarShop";
import Footer from "../../Components/Footer/Footer";
import styleContainer from "../../Components/GlobalCss/InContainer.module.css";
import style from "./Profile.module.css";

export default function Profile() {
  const dispatch = useDispatch();
  const [userData, setUser] = useState({});
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      axios
        .get("https://proyecto-grupal.herokuapp.com/owners")
        .then(au => {
          const userDb = au.data.find(u => u.email === user.email);
          setUser({
            nombre: user.name,
            picture:
              userDb && userDb.profilePicture && userDb.profilePicture[0]
                ? userDb.profilePicture[0]
                : "/assets/img/notloged.png",
            email: user.email,
            pets: userDb ? userDb.pets : [],
            address: userDb.address,
            isAdmin: userDb.isAdmin
          });
        })
        .then(() => {
          return axios.get("https://proyecto-grupal.herokuapp.com/events");
        });
    }
  }, [user, dispatch]);

  return (
    <main>
      <NavBarShop />
      <div className={styleContainer.container}>
        <section className={style.infoProfile}>
          <img src={userData.picture} alt="profilePicture" />
          <article className={style.profile}>
            <h1 className={style.name}>{user.name}</h1>
            <div>
              <Link to="/mis-datos">
                <button className="terciaryButton">Editar perfil</button>
              </Link>
            </div>
          </article>
        </section>
        <section className={style.mainInfoProfile}>
          <h2>Mis datos</h2>
          <h4 className={style.email}>{" "}Correo electronico: <span className={style.span}>{user.email}</span></h4>
          <h4 className={style.address}>
            Direccion:{" "}
            <span className={style.span}>{userData.address ? userData.address.road : null}</span>
          </h4>
        </section>
        <br />
        <br />
        <section>
          {userData.isAdmin ? (
            <div className={style.adminPanel}>
              <Link to="/admin/listado-productos">
                <button className="primaryButton">Ver listado de productos en Petshop</button>
              </Link>
              <Link to="/admin/ventas-petshop">
                <button className="primaryButton">Ver listado de comprobantes de compra</button>
              </Link>
              <Link to="/admin/get-users">
                <button className="primaryButton">Ver listado de usuarios registrados</button>
              </Link>
            </div>
          ) : null}
        </section>
      </div>
      <Footer />
    </main>
  );
};