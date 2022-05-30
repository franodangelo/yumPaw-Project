import React from "react";
import styles from "../Shop/ProductCard.module.css";
import { Link } from "react-router-dom";

const ProductCard = ({id, profilePicture, name, price}) => {
  return (
    <Link to={`/shop/${id}`}>
    <div className={styles.container}>
      <div className={styles.card}>
        <img src={profilePicture} alt="" className={styles.cardImg} />
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Heart_coraz%C3%B3n.svg/640px-Heart_coraz%C3%B3n.svg.png" alt="" className={styles.addFav}/>
        <div className={styles.cardInfo}>
          <h2 className={styles.cardTitle}>{name}</h2>
          <div className={styles.cardBottom}>
            <p className={styles.price}>${price}</p>
            {/* <button className={styles.addButton}>Agregar al carrito</button> */}
          </div>
        </div>
      </div>
    </div>
    </Link>
  );
};

export default ProductCard;
