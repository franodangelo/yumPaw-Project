import React from "react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <div className={styles.container}>
      <div className={styles.footerFlex}>
        <div className={styles.footerLeft}>
          <h2>yumPaw</h2>
          <p className={styles.newsletter}>Alan, Frano, Leo, Matheus, Sabri</p>
        </div>
        <div className={styles.footerRight}>
          <a href="#">
            <img src="../assets/img/arrow-up.svg" alt="Go Up" className={styles.goUp} />
          </a>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p className={styles.copyright}>Copyright @yumPaw - 2022</p>
        <div className={styles.social}>
          <a href="https://github.com/teixeira26/Proyecto-grupal" target="__blank"><img src="./assets/img/logo-github.svg" alt="" /></a>
        </div>
        <div className={styles.social}>
          <img src="./assets/img/logo-instagram.svg" alt="" target='__blank' className={styles.social} />
        </div>
      </div>
    </div>
  );
};