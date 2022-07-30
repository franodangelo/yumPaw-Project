import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { addTofavorites, getProducts } from "../../redux/actions/petshopActions";
import NavBarShop from "../NavBar/NavBarShop";
import NoFavs from "../../Views/Profile/NoFavs";
import Footer from '../Footer/Footer';
import inContainer from "../GlobalCss/InContainer.module.css";
import shopStyles from "../Shop/Shop.module.css";
import styles from "./Favorites.module.css";

export default function Favorites() {
  const { user } = useAuth0();
  const dispatch = useDispatch();
  const [productsFav, setProductsFav] = useState([]);
  const [productsFavNumber, setProductsFavNumber] = useState([]);
  const products = useSelector((state) => state.filteredProducts);

  useEffect(() => {
    axios.get(`https://proyecto-grupal.herokuapp.com/owners/getFavorites/${user.email}`).then(x => {
      setProductsFavNumber(x.data);
    })
    dispatch(getProducts());
  }, [dispatch, user.email]);

  useEffect(() => {
    setProductsFav(products.filter(x => {
      if (productsFavNumber.includes(x.id)) {
        return x;
      }
    }))
  }, [products, productsFavNumber]);

  async function deleteFav(id) {
    let withoutFav = productsFav.filter(fav => fav.id !== id);
    setProductsFav(withoutFav);
    const AllOwners = await axios.get("https://proyecto-grupal.herokuapp.com/owners");
    const owner = AllOwners.data.find(x => x.email === user.email);
    let objToPut = {
      ...owner,
      favorites: owner.favorites[0] ? owner.favorites.filter(x => x !== id) : []
    }
    await axios.put("https://proyecto-grupal.herokuapp.com/owners/addFavorite", objToPut);
    dispatch(addTofavorites(objToPut.favorites));
  };

  return (
    <div>
      <NavBarShop />
      <div className={inContainer.container}>
        <Link to='/shop'>
          <img src="/assets/img/arrow-left.svg" alt="" className={shopStyles.leftArrow} />
        </Link>
        <h1 className={styles.favTitle}>Mis favoritos</h1>
        <div className={styles.gridFav}>
          {productsFav && productsFav.length ? productsFav.map(x => {
            return (
              <div className={styles.card}>
                <div className={styles.cardData}>
                  <Link to={`/shop/${x.id}`}>
                    <img className={styles.favImg} alt='img not found' src={x.profilePicture}></img>
                  </Link>
                  <div>
                    <h1 className={styles.nameFav}>{x.name}</h1>
                    <p className={styles.available}>Stock disponible: {x.stock} unidades</p>
                  </div>
                </div>
                <button className="secondaryButton" onClick={() => deleteFav(x.id)}>Eliminar de favoritos</button>
              </div>
            )
          }) : <NoFavs />}
        </div>
      </div>
      <Footer />
    </div>
  )
};