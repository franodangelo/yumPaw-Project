import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import NavBarShop from "../NavBar/NavBarShop";
import HomeCard from "./HomeCard";
import Footer from "../Footer/Footer";
import inContainer from "../GlobalCss/InContainer.module.css";
import styles from "../Home/Home.module.css";

export default function Home() {
  const { user, isAuthenticated } = useAuth0();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({});
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    if (user) {
      axios.get("https://proyecto-grupal.herokuapp.com/owners").then((x) => {
        const userdb = x.data.find((x) => x.email === user.email);
        if (userdb) {
          setUserData({
            nombre: user.name,
            picture:
              userdb.profilePicture && userdb.profilePicture[0]
                ? userdb.profilePicture[0]
                : "/assets/img/notloged.png",
            email: user.email,
            pets: userdb.pets,
            address: userdb.address,
            isAdmin: userdb.isAdmin,
            isBanned: userdb.isBanned
          });
        }
      });
    }
  }, [dispatch, user]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      function (err) {
        console.log(err);
      },
      {
        enableHighAccuracy: true
      }
    );
  }, []);

  useEffect(() => {
    if (user && location.latitude !== 0) {
      let owner = {
        email: user.email,
        name: user.given_name,
        lastName: user.family_name,
        latitude: location.latitude,
        longitude: location.longitude
      };
      axios.post("https://proyecto-grupal.herokuapp.com/owners", owner);
    }
  }, [user, location]);

  return (
    <div className={styles.body}>
      {isAuthenticated && console.log(user)}
      <NavBarShop />
      <div className={inContainer.container}>
        <div className={styles.container}>
          <h1 className={styles.homeTitle}>¿Qué estás buscando?</h1>
          <div className={styles.cardWrapper}>
            <Link to="/yumpis">
              <HomeCard
                name="Paseos y hospedaje"
                img="assets/img/paseador.png"
              />
            </Link>
            <Link to="/shop">
              <HomeCard name="Comprar productos" img="assets/img/shop.png" />
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.stickyFooter}>
        <Footer />
      </div>
    </div>
  );
};