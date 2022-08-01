import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { getById, cleanDetail } from "../../redux/actions/petshopActions";
import { getOwners } from "../../redux/actions/ownProvActions";
import NavBarShop from "../NavBar/NavBarShop";
import Loader from "../Loading/Loader";
import ProductDetailCard from "./ProductDetailCard";
import Footer from "../Footer/Footer";
import inContainer from "../GlobalCss/InContainer.module.css";
import styles from "../Shop/ProductDetail.module.css";

export default function ProductDetail() {
  let dispatch = useDispatch();
  const { user } = useAuth0();
  let { id } = useParams();
  let product = useSelector(state => state.productDetail);

  useEffect(() => {
    dispatch(getById(id));
    dispatch(getOwners());
  }, [dispatch, id]);

  useEffect(() => {
    return () => dispatch(cleanDetail());
  }, [dispatch]);

  const allUsers = useSelector(state => state.owners);
  const userDb = user && allUsers.length ? allUsers.find(au => au.email === user.email) : null;

  return (
    <div className={styles.container}>
      <NavBarShop />
      <div className={inContainer.container}>
        <NavLink to="/shop">
          <img src="/assets/img/arrow-left.svg" alt="" className={styles.leftArrow} />
        </NavLink>
        {!product.length
          ? <Loader />
          : product.map((p) => {
            return (
              <ProductDetailCard
                key={p.id}
                id={p.id}
                profilePicture={p.profilePicture}
                name={p.name}
                price={p.price}
                category={p.category}
                stock={p.stock}
                description={p.description}
              />
            );
          })}
        {userDb?.isAdmin ? <Link to='/admin/listado-productos'><button className="primaryButton">VOLVER AL LISTADO</button></Link> : null}
      </div>
      <Footer />
    </div>
  );
};