import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import Swal from "sweetalert2";
import { addTofavorites, chargeCart } from "../../redux/actions/petshopActions";
import Login from "../Auth0/Login";
import DropdownMenu from "./DropdownMenu";
import OutContainer from "../GlobalCss/OutContainer.module.css";
import styles from "./NavBarShop.module.css";

export default function NavBar() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth0();
  const [total, setTotal] = useState(0);
  const [productsFavNumber, setProductsFavNumber] = useState(0);
  const [userData, setUser] = useState({});
  const state = useSelector((state) => {
    return state;
  });
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (user && user.email) {
      axios
        .get(`https://proyecto-grupal.herokuapp.com/owners/getFavorites/${user.email}`)
        .then(f => {
          setFavorites(f.data);
          dispatch(addTofavorites(f.data));
        });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      axios.get("https://proyecto-grupal.herokuapp.com/owners").then(u => {
        const userdb = u.data.find(u => u.email === user.email);
        if (userdb) {
          setUser({
            nombre: user.name,
            picture:
              userdb.profilePicture && userdb.profilePicture[0]
                ? userdb.profilePicture[0]
                : "/assets/img/notloged.png",
            email: user.email,
            pets: userdb.pets,
            address: userdb.address
          });
        }
      });
    }
  }, [dispatch, user]);

  useEffect(() => {
    dispatch(chargeCart("cart"));
  }, [dispatch]);

  useEffect(() => {
    let counter = 0;
    state.cart.forEach((el) => {
      counter = counter + el.quantity;
    });
    setTotal(counter);
  }, [state.cart]);

  useEffect(() => {
    setProductsFavNumber(state.favorites ? state.favorites.length : 0);
  }, [state.favorites]);

  return (
    <div className={OutContainer.container}>
      <nav className={styles.nav}>
        <div className={styles.item}>
          <NavLink to={user ? '/inicio' : '/'} className={styles.logoLink}>yumPaw</NavLink>
        </div>
        <div className={styles.item}>
          <NavLink to="/nosotros" className={styles.navLink}>Nosotros</NavLink>
          <NavLink to="/contacto" className={styles.navLink}>Contacto</NavLink>
          <NavLink to={user ? '/yumpis' : '/'} className={styles.navLink}
            onClick={() => { if (!user) Swal.fire('Primero tenés que iniciar sesión.', '', 'warning') }}>
            Yumpis
          </NavLink>
          <NavLink to="/shop" className={styles.navLink}>PetShop</NavLink>
        </div>
        <div className={styles.item}>
          <div className={styles.icons}>
            <div className={styles.icon}>
              <NavLink to="/mi-carrito" className={styles.navLinkIcon}>
                <img src="../../assets/img/shopping-bag.svg" alt="" />
                <div className={styles.circle}>{total}</div>
              </NavLink>
            </div>
            <div className={styles.icon}>
              <NavLink to={user ? '/favoritos' : '/'} className={styles.navLinkIcon}
                onClick={() => { if (!user) Swal.fire('Primero tenés que iniciar sesión.', '', 'warning') }}>
                <img src="../../assets/img/favorite.svg" alt="" />
                <div className={styles.circle}>{productsFavNumber}</div>
              </NavLink>
            </div>
          </div>
          <div className={styles.buttons}>
            {!isAuthenticated && <Login></Login>}
            {isAuthenticated && <DropdownMenu />}
          </div>
        </div>
      </nav>
    </div>
  );
};