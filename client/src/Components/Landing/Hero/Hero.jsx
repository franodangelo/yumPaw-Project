import React from "react";
import LoginLanding from '../../Auth0/LoginLanding';
import InContainer from "../../GlobalCss/InContainer.module.css";
import styles from "../Hero/Hero.module.css";

export default function Hero(props) {
  return (
    <div className={InContainer.container}>
      <section className={styles.flexHero}>
        <div className={styles.leftHero}>
          <h1 className={styles.textHero}>¡Te damos la <br /> bienvenida a <br /> yumPaw!</h1>
          <p className={styles.paragraph}>Donde podrás encontrar todo para tus mascotas en un solo sitio. <br /> ¿Qué estás esperando para sumarte?</p>
          <div className={styles.previewItems}>
            <LoginLanding/ >
          </div>
        </div>
        <div className={styles.rightHero}>
          <img src="/assets/img/vector.png" alt="" className={styles.imgHero}/>
        </div>
      </section>
    </div>
  );
};