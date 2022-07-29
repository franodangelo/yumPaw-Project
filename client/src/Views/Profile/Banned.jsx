import React from 'react';
import styles from "./Banned.module.css";

export default function Banned() {
  return (
    <div className={styles.container}>
      <img src="./assets/img/ban.png" alt="" />
      <h1 className={styles.title}>Lamentablemente tu cuenta ha sido inactivada :(</h1>
    </div>
  )
}