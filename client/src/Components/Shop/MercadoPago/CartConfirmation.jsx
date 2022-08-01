import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import {
  chargeCart,
  clearAllCart,
  postSold,
} from "../../../redux/actions/petshopActions";
import style from "./CartConfirmation.module.css";

export default function CartConfirmation() {
  const dispatch = useDispatch();
  const { user } = useAuth0();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const [successfulPurchase, setSuccessfulPurchase] = useState("waiting");
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  let query = useQuery();
  let payment_id = query.get("payment_id");
  let collection_id = query.get("collection_id");
  let status = query.get("status");
  const clientID = localStorage.getItem("clientID");

  useEffect(() => {
    dispatch(chargeCart("cart"));
  }, [dispatch]);

  const clearCart = () => {
    dispatch(clearAllCart("cart"));
  };

  let net = () => {
    cart.forEach((i) => {
      let total = i.stock - i.quantity;
      return axios.put(`https://proyecto-grupal.herokuapp.com/products/${i.id}`, {
        stock: total
      });
    });
  };

  useEffect(() => {
    (async () => {
      if (payment_id !== null && status === "approved") {
        setSuccessfulPurchase("bought");

        let response = await axios.get(
          `https://api.mercadopago.com/v1/payments/${collection_id}?access_token=APP_USR-7012537343723443-053123-5facd15f88649bf31385f5ab06f47cb9-1134140317`
        );

        let paymentResponse = {
          id: response.data.id,
          first_name: user.given_name,
          last_name: user.family_name,
          items: response.data.additional_info.items,
          status: response.data.status,
          date_created: response.data.date_created,
          transaction_amount: response.data.transaction_amount,
          email: user.email
        }

        dispatch(postSold(paymentResponse));

        setTimeout(() => {
          clearCart();
        }, 3000);

        setTimeout(() => {
          navigate("/shop");
        }, 4000);
      };
    })();
  }, [payment_id, status, clientID, navigate, clearCart, user]);

  return (
    <>
      <div className={style.container}>
        <p className={style.paragraph}>Esperando confirmación de compra:</p>
        <h2 className={style.confirm}>Compra confirmada</h2>
        {successfulPurchase === "waiting" && <h3>Procesando pago...</h3>}
        {successfulPurchase === "bought" && <h3>¡Gracias por tu compra!</h3>}
        {successfulPurchase === "error" && <h3>Error en la compra</h3>}
        {net()}
        <h3 className={style.redi}>Serás redirigido a tu perfil en unos segundos...</h3>
      </div>
    </>
  );
};