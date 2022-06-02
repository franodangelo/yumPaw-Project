import React, { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import NavBarRegistered from "../NavBar/NavBarRegistered";
import Hero from "./Hero/Hero";
import styles from "../Landing/Landing.module.css";
import WhatWeOffer from "./WhatWeOffer/WhatWeOffer";
import Team from "./Team/Team";
import Footer from "../Footer/Footer";
import { useAuth0, User } from "@auth0/auth0-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Landing() {
  const [nombre, setNombre] = useState();
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      buscarUser();
    }
  }, [isAuthenticated]);

  const buscarUser = async () => {
    try {
      let dbOwner = await axios.get("http://localhost:3001/owners"); //[{},{},{}]
      console.log(dbOwner);
      let userInfo = dbOwner.data.find((x) => x.email === user.email);
      if (typeof userInfo === "object") {
        navigate("/home");
        setNombre(user.name);
      } else {
        navigate("/tipo-usuario");
      }

      // console.log("soy el usuario \0/", userInfo);
    } catch (error) {
      navigate("/tipo-usuario");
    }
  };
  return (
    <div id="landing">
      {!isAuthenticated && (
        <div className={styles.navBar}>
          <NavBar />
        </div>
      )}

      {isAuthenticated && (
        <div className={styles.navBar}>
          <NavBarRegistered />
        </div>
      )}

      <div className={styles.hero}>
        <Hero img="/assets/img/pets-landing-cover.jpg" />
      </div>

      <div id="wwo" className={styles.whatWeOffer}>
        <WhatWeOffer />
      </div>

      <div id="team" className={styles.team}>
        <Team />
      </div>

      <div className={styles.footer}>
        <Footer />
      </div>

    </div>
  );
}

export default Landing;