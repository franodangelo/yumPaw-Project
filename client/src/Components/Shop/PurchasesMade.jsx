import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { getOwners } from "../../redux/actions/ownProvActions";
import NavBar from "../NavBar/NavBarShop";
import EachPurchase from "./EachPurchase";
import Footer from "../Footer/Footer";
import InContainer from "../GlobalCss/InContainer.module.css";
import style from "./PurchasesMade.module.css";

export default function PurchasesMade() {
  const dispatch = useDispatch();
  const { user } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getOwners());
  }, [dispatch]);

  const users = useSelector(state => state.owners);
  let userDb = users.find(us => us.email === user.email);

  function goToShop() {
    navigate("/shop"); userDb
  }

  return (
    <>
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
          {userDb?.solds.length ? (
            userDb?.solds.map((s) => {
              return (
                <EachPurchase
                  id={s.id}
                  state={s.status}
                  date={s.date_created}
                  price={s.transaction_amount}
                  items={s.items}
                />
              );
            })
          ) : (
            <div>
              <h2>Todavía no hiciste ninguna compra</h2>
            </div>
          )}
        </div>
        <div className={style.shop}>
          <button className="secondaryButton" onClick={goToShop}>Ir al Petshop</button>
        </div>
      </div>
      <Footer />
    </>
  );
};