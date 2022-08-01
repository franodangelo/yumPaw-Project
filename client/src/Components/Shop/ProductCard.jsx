import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import Swal from 'sweetalert2';
import styles from "../Shop/ProductCard.module.css";

export default function ProductCard({
  profilePicture,
  name,
  price,
  isFavorite,
  id,
  setFavorites,
  favorites
}) {
  const { user } = useAuth0();
  const addFavorite = async () => {
    if (user) {
      if (!isFavorite) {
        const AllOwners = await axios.get("https://proyecto-grupal.herokuapp.com/owners");
        const owner = AllOwners.data.find(aod => aod.email === user.email);
        let objectToPut = {
          ...owner,
          favorites: owner.favorites[0] ? [...owner.favorites, id] : [id]
        };
        setFavorites([...favorites, id]);

        await axios.put("https://proyecto-grupal.herokuapp.com/owners/addFavorite", objectToPut);
      } else {
        const AllOwners = await axios.get("https://proyecto-grupal.herokuapp.com/owners");
        const owner = AllOwners.data.find(aod => aod.email === user.email);
        let objectToPut = {
          ...owner,
          favorites: owner.favorites[0]
            ? owner.favorites.filter(of => of !== id)
            : []
        };
        setFavorites(favorites.filter(ff => ff !== id));
        await axios.put("https://proyecto-grupal.herokuapp.com/owners/addFavorite", objectToPut);
      }
    }
    else {
      Swal.fire('Necesitás iniciar sesión para agregar a favoritos.', '', 'warning')
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.addFav}
          onClick={addFavorite}>
          {
            !isFavorite
              ? <img src="../assets/img/favorite-item.svg" alt="" />
              : <img src="../assets/img/favorite-fill.svg" alt="" />
          }
        </div>
        <Link to={`/shop/${id}`}>
          <img src={profilePicture} alt="" className={styles.cardImg} />
          <div className={styles.cardInfo}>
            <div className={styles.cardBottom}>
              <p className={styles.price}>${price}</p>
              <h2 className={styles.cardTitle}>{name}</h2>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};