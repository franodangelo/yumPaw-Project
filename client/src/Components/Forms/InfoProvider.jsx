import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { getOwners, postProvider } from "../../redux/actions/ownProvActions";
import NavBar from "../NavBar/NavBarShop";
import Footer from "../Footer/Footer";
import InContainer from "../GlobalCss/InContainer.module.css"
import style from "./InfoProvider.module.css";

export default function InfoProvider() {
  const dispatch = useDispatch();
  const { user } = useAuth0();
  const provider = useSelector(state => state.owners);
  const [userInfo, setUserInfo] = useState(false)

  useEffect(() => {
    dispatch(getOwners());
  }, [dispatch]);
  useEffect(() => {
    if (user) {
      setUserInfo(provider.find(x => x.email === user.email));
    }
  }, [provider, user]);
  function walk() {
    dispatch(
      postProvider({
        email: user.email,
        name: user.given_name,
        lastName: user.family_name,
        service: ["paseo"],
        latitude: userInfo.latitude,
        longitude: userInfo.longitude
      })
    );
  }

  function lodging() {
    dispatch(
      postProvider({
        email: user.email,
        name: user.given_name,
        lastName: user.family_name,
        service: ["hospedaje"],
        latitude: userInfo.latitude,
        longitude: userInfo.longitude
      })
    );
  }

  return (
    <div>
      <NavBar />
      <div className={InContainer.container}>
        <NavLink to="/mi-perfil">
          <img
            src="/assets/img/arrow-left.svg"
            alt=""
            className={style.leftArrow}
          />
        </NavLink>
        <div className={style.container}>
          <Container>
            <div className={style.centerFlex}>
              <h2 className={style.title}>¿Qué servicio te gustaría ofrecer?</h2>
              <div className={style.buttons}>
                <div className={style.button}>
                  <Link to="/paseo">
                    <button onClick={walk} disabled={userInfo ? false : true} className='primaryButton'>PASEO</button>
                  </Link>
                </div>
                <div>
                  <Link to="/hospedaje">
                    <button onClick={lodging} disabled={userInfo ? false : true} className='primaryButton'>HOSPEDAJE</button>
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
      <Footer />
    </div>
  );
};
