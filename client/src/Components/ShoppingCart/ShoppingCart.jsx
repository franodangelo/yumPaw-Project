import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Swal from "sweetalert2";
import { chargeCart, clearAllCart } from "../../redux/actions/petshopActions";
import NavBarShop from "../NavBar/NavBarShop";
import CartItem from "./CartItem";
import Footer from "../Footer/Footer";
import InContainer from "../GlobalCss/InContainer.module.css";
import styles from "../ShoppingCart/ShoppingCart.module.css";
import "../../index.css";

export default function ShoppingCart() {
  const dispatch = useDispatch();
  const { user } = useAuth0();
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    if (user) {
      dispatch(chargeCart("cart"));
    }
  }, [user, dispatch]);

  useEffect(() => {
    var addition = 0;
    if (cart && cart.length) {
      cart.forEach(c => {
        addition += c.price * c.quantity;
      });
      setTotal(addition);
    } else {
      setTotal(0);
    }
  }, [cart]);

  const clearCart = () => {
    dispatch(clearAllCart('cart'));
    setTotal(0);
  };

  return (
    <div>
      <NavBarShop />
      <div className={InContainer.container}>
        <NavLink to={user ? "/shop" : '/'}>
          <img src="./assets/img/arrow-left.svg" alt="" />
        </NavLink>
        <h2 className={styles.cartTitle}>Carrito</h2>
        <h3 className={styles.cartProducts}>Productos a comprar</h3>
        <div className={styles.cartSubtitles}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tr}>
                <th className={styles.th}>
                  <p className={styles.imagen}>Imagen</p>
                </th>
                <th className={styles.th}>
                  <p className={styles.product}>Producto</p>
                </th>
                <th className={styles.th}>
                  <p className={styles.price}>Precio</p>
                </th>
                <th className={styles.th}>
                  <p className={styles.price}>Cantidad</p>
                </th>
                <th className={styles.th}>
                  <p className={styles.price}>Subtotal</p>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <article className={styles.productList}>
          {cart && cart.length > 0 ? (
            cart.map((item, index) => (
              <CartItem
                key={index}
                name={item.name}
                image={item.profilePicture}
                price={item.price}
                quantity={item.quantity}
                id={item.id}
                stock={item.stock}
              />
            ))
          ) : (
            <p className={styles.noProducts}>No hay ningún producto en el carrito</p>
          )}
        </article>
        <div className={styles.cartBottom}>
          <div>
            <div className={styles.totalFlex}>
              <h3 className={styles.total}>Total: <span className={styles.totalNum}>${total}</span> </h3>
            </div>
            <div className={styles.purchase}>
              {cart && cart.length > 0 ? (
                <button className="primaryButton" onClick={() => {
                  if (user && user.email) navigate('/purchaseConfirmation')
                  else (Swal.fire('Tenés que ingresar en la página para poder comprar'))
                }}>Continuar con el pago
                </button>
              ) : (
                <div></div>
              )}
            </div>
          </div>
          {cart && cart.length > 0 ? (
            <article>
              <button className="secondaryButton" onClick={clearCart}>Limpiar carrito</button>
            </article>
          ) : (
            <div></div>
          )}
        </div>
      </div>
      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  );
};