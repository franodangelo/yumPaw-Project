import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { chargeCart, addTofavorites } from "../../redux/actions/petshopActions";
import NavBarShop from "../NavBar/NavBarShop";
import InLoader from "../Loading/loading";
import ProductCard from "./ProductCard";
import ShopFilters from "./ShopFilters";
import Paginated from "../Paginated";
import Footer from "../Footer/Footer";
import inContainer from "../GlobalCss/InContainer.module.css";
import styles from "../Shop/Shop.module.css";

export default function Shop() {
  const dispatch = useDispatch();
  const { user } = useAuth0();
  const [favorites, setFavorites] = useState([]);
  const products = useSelector((state) => state.filteredProducts);

  useEffect(() => {
    if (favorites) {
      dispatch(addTofavorites(favorites));
    }
  }, [favorites]);

  useEffect(() => {
    if (user && user.email) {
      axios
        .get(`https://proyecto-grupal.herokuapp.com/owners/getFavorites/${user.email}`)
        .then(gf => {
          setFavorites(gf.data);
        });
      dispatch(chargeCart("cart"));
    }
  }, [dispatch, user]);

  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  const [currentPage, setCurrentPage] = useState(1);
  const initialStateProductsPerPage = 12;
  const [productsPerPage, setProductsPerPage] = useState(initialStateProductsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products?.slice(indexOfFirstProduct, indexOfLastProduct);
  const paginated = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={styles.container}>
      <NavBarShop />
      <div className={inContainer.container}>
        <NavLink to="/inicio">
          <img
            src="/assets/img/arrow-left.svg"
            alt=""
            className={styles.leftArrow}
          />
        </NavLink>
        <h1 className={styles.shopTitle}>¡Encontrá lo mejor para tus mascotas!</h1>
        <div className={styles.shopFlex}>
          <div className={styles.shopFilters}>
            <ShopFilters />
          </div>
          <section className={styles.shopGrid}>
            {!currentProducts.length
              ? <InLoader />
              : currentProducts.map(cp => {
                return cp.stock > 0 && cp.isActive ? (
                  <ProductCard
                    key={cp.id}
                    id={cp.id}
                    setFavorites={setFavorites}
                    favorites={favorites}
                    isFavorite={favorites && favorites.includes(cp.id)}
                    profilePicture={cp.profilePicture}
                    name={cp.name}
                    price={cp.price}
                  />
                ) : null;
              })}
          </section>
        </div>
        <div className={styles.paginado}>
          <Paginated
            itemsPerPage={productsPerPage}
            items={products.length}
            paginated={paginated}
            currentPage={currentPage}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};