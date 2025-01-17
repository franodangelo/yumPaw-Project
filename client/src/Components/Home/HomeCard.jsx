import React from "react";
import styles from "../Home/HomeCard.module.css";

export default function HomeCard(props) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src={props.img} alt="" className={styles.cardImg} />
        <h2 className={styles.cardTitle}>{props.name}</h2>
      </div>
    </div>
  );
};