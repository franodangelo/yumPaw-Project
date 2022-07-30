import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { Container } from "semantic-ui-react";
import NavBar from "../NavBar/NavBarShop";
import Footer from "../Footer/Footer";
import InContainer from "../GlobalCss/InContainer.module.css"
import styles from "./RatingOwners.module.css"
import style from "../Providers/ProvidersCard.module.css";

export default function RatingsOwner() {
  const { user, isAuthenticated } = useAuth0();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      axios.get("https://proyecto-grupal.herokuapp.com/reviews").then(mr => {
        let myreviews = mr.data.filter(mrf => mrf.owner.email === user.email);
        if (myreviews.length) setReviews(myreviews);
      });
    }
  }, [isAuthenticated]);

  return (
    <div>
      <NavBar />
      <div className={style.container}>
        <div className={styles.container}>
          <NavLink to="/mi-perfil">
            <img
              src="/assets/img/arrow-left.svg"
              alt=""
              className={styles.leftArrow}
            />
          </NavLink>
          <div className={InContainer.container}>
            <Container>
              <div className={style.centerFlex}>
                <h2 style={{ display: "inline" }}>Mis calificaciones: </h2>
                <div className={styles.contenedor}>
                  <div style={{ marginBottom: 30 }}>
                    {reviews && reviews.length
                      ? reviews.map((x, y) => {
                        return (
                          <div key={y} className={styles.contenedor}>
                            <hr />
                            <div>
                              <p className={style.star}>
                                {x.review >= 1 ? "★" : "☆"}
                              </p>
                              <p className={style.star}>
                                {x.review >= 2 ? "★" : "☆"}
                              </p>
                              <p className={style.star}>
                                {x.review >= 3 ? "★" : "☆"}
                              </p>
                              <p className={style.star}>
                                {x.review >= 4 ? "★" : "☆"}
                              </p>
                              <p className={style.star}>
                                {x.review === 5 ? "★" : "☆"}
                              </p>
                            </div>
                            <h4 style={{ display: "inline" }}>
                              {x.owner.name} {x.owner.lastName}:
                            </h4>
                            <p style={{ display: "inline", color: "blue" }}>
                              {" "}
                              {x.message}
                            </p>
                            <h4>
                              Reseña realizada a: {x.provider.name}{" "}
                              {x.provider.lastName}
                            </h4>
                            <Link
                              to={`/cambiar-resena/${x.id}?providerEmail=${x.provider.email}`}
                            >
                              <button style={{ display: "block" }} className='secondaryButton'>Cambiar</button>
                            </Link>
                          </div>
                        );
                      })
                      : null}
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};