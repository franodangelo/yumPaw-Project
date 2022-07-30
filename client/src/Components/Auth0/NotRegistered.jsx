import React from "react";
import { Link } from "react-router-dom";
import styles from "./NotRegistered.module.css";
import InContainer from "../GlobalCss/InContainer.module.css";

export default function NotRegistered() {
  return (
    <div>
      <div className={InContainer.container}>
        <div className={styles.container}>
          <img src="./assets/img/not-registered.png" alt="" className={styles.img} />
          <div className={styles.log}>
            <h1 className={styles.text}>¡OOPS! <br /> Para continuar tenés que iniciar sesión</h1>
            <Link to='/'>
              <button className='primaryButton'>Ir al inicio</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};