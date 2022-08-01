import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import MercadoPago from "./MercadoPago";
import { chargeCart } from "../../../redux/actions/petshopActions";
import NavBar from "../../NavBar/NavBarShop";
import PurchaseDetail from "./PurchaseDetail";
import Footer from "../../Footer/Footer";
import InContainer from "../../GlobalCss/InContainer.module.css";
import styles from "./PurchaseConfirmation.module.css";

export default function PurchaseConfirmation() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth0();
  const [total, setTotal] = useState(0);
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    if (user) {
      dispatch(chargeCart("cart"));
    }
  }, [dispatch, user]);

  useEffect(() => {
    var addition = 0;
    if (cart && cart.length) {
      cart.forEach((x) => {
        addition += x.price * x.quantity;
      });
      setTotal(addition);
    } else {
      setTotal(0);
    }
  }, [cart]);

  return (
    <div>
      <NavBar />
      <div className={InContainer.container}>
        <div className={styles.container}>
          <h2 className={styles.title}>Detalle de tu compra</h2>
          {cart && cart.length > 0 ? (
            cart.map((item, index) => (
              <div>
                <PurchaseDetail
                  key={index}
                  name={item.name}
                  image={item.profilePicture}
                  price={item.price}
                  quantity={item.quantity}
                />
              </div>
            ))
          ) : (
            <h1>No hay ningún producto en el carrito</h1>
          )}
          <div className={styles.compra}>
            <h4 className={styles.total}>Monto total: ${total}</h4>
          </div>
          <h2 className={styles.continuar}>Continuá con tu pago</h2>
          <div className={styles.buttonFlex}>
            <div className={styles.pagar}>
              <MercadoPago cart={cart} />
            </div>
          </div>
        </div>
        <Link to="/mi-carrito">
          <button className="secondaryButton">Volver al carrito</button>
        </Link>
      </div>
      <Footer />
    </div>
  );
};