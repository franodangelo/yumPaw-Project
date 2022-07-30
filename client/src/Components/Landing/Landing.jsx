import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import NavBarShop from '../NavBar/NavBarShop'
import Hero from "./Hero/Hero";
import WhatWeOffer from "./WhatWeOffer/WhatWeOffer";
import Team from "./Team/Team";
import Footer from "../Footer/Footer";
import styles from "../Landing/Landing.module.css";

export default function Landing() {
  const { user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const findUser = async () => {
    try {
      let dbOwner = await axios.get("https://proyecto-grupal.herokuapp.com/owners");
      let userInfo = dbOwner.data.find(u => u.email === user.email);
      if (typeof userInfo === "object") {
        navigate("/inicio");
        setNombre(user.name);
      } else {
        axios.post('https://proyecto-grupal.herokuapp.com/mailer/', { email: user.email, subject: "Te damos la bienvenida a YumPaw!", text: "Gracias por ingresar a nuestra plataforma, esperamos que disfrutes tu experiencia" });
        navigate("/inicio");
      }
    } catch (err) {
      navigate("/inicio");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      findUser();
    }
  }, [isAuthenticated, findUser]);

  return (
    <div id="landing">
      <div className={styles.navBar}>
        <NavBarShop />
      </div>
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
};