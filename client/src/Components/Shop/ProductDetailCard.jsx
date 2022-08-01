import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TYPES } from "../../redux/actions/shoppingActions";
import { getProducts, chargeCart } from "../../redux/actions/petshopActions";
import styles from "./ProductDetailCard.module.css";

export default function ProductDetailCard({ profilePicture, name, price, category, stock, description, id }) {
  const dispatch = useDispatch();
  const { user } = useAuth0();
  const [count, setCount] = useState(1);
  const cart = useSelector((state) => state.cart);
  const cartItem = cart.find(fc => fc.id === id);

  useEffect(() => {
    dispatch(getProducts());;
    dispatch(chargeCart('cart'));
  }, [dispatch, user]);

  const addItem = () => {
    if (cartItem) {
      var limit = cartItem.stock - cartItem.quantity;
    } else {
      limit = stock;
    }
    if (count < limit) {
      setCount(count + 1);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Estás intentando agregar más productos de los que hay en stock'
      });
    }
  };

  const deleteItem = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const addToCart = () => {
    if (cartItem) {
      var limit = cartItem.stock - cartItem.quantity;
    } else {
      limit = stock;
    }
    if (count > 0 && count <= limit) {
      toast.success("Producto agregado al carrito", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined
      });
      dispatch({
        type: TYPES.ADD_TO_CART,
        payload: id,
        email: 'cart',
        quantity: count
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Estás intentando agregar más productos de los que hay en stock'
      });
    }
  };

  return (
    <div>
      <div className={styles.detailFlex}>
        <img src={profilePicture} alt="" className={styles.detailImg} />
        <div className={styles.detailRight}>
          <h3 className={styles.detailCategory}>{category}</h3>
          <h1 className={styles.detailTitle}>{name}</h1>
          <p className={styles.detailInfo}>{description}</p>
          <p className={styles.detailPrice}>${price}</p>
          <p className={styles.detailQuantity}>Cantidad</p>
          <div className={styles.productQuantity}>
            <span className={styles.button} onClick={deleteItem}>
              -
            </span>
            <div className={styles.count}>{count}</div>
            <span className={styles.button} onClick={addItem}>
              +
            </span>
          </div>
          <div className={styles.detailAddCart}>
            <p className={styles.cartQuantity}>Unidades en el carrito: {cartItem?.quantity}</p>
            <p className={styles.stock}>Stock disponible: {stock}</p>
            <button className="primaryButton" onClick={addToCart}>Agregar al carrito</button>
            <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </div>
      </div>
    </div>
  );
};