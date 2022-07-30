import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { putEvent } from "../../../redux/actions/ownProvActions";
import style from "../../Shop/MercadoPago/CartConfirmation.module.css";

export default function ReserveConfirmation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth0();
  const [successfulPurchase, setSuccessfulPurchase] = useState("waiting");

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  let query = useQuery();
  let payment_id = query.get("payment_id");
  let collection_id = query.get("collection_id");
  let status = query.get("status");
  const eventID = useSelector(state => state.selectedEvent);

  useEffect(() => {
  }, [eventID])

  useEffect(() => {
    (async () => {
      if (payment_id !== null && status === "approved") {
        setSuccessfulPurchase("bought");
        let res = await axios.get(
          `https://api.mercadopago.com/v1/payments/${collection_id}?access_token=APP_USR-7012537343723443-053123-5facd15f88649bf31385f5ab06f47cb9-1134140317`
        );

        let resp = {
          idMP: res.data.id,
          payment: res.data.status,
          date_created: res.data.date_created
        };

        dispatch(putEvent(localStorage.getItem("id"), resp));

        setTimeout(() => {
          navigate("/mi-perfil");
        }, 4000);
      }
    })();
  }, [payment_id, navigate, user, dispatch, status]);

  return (
    <>
      <div className={style.container}>
        <p className={style.paragraph}>Esperando confirmación de compra:</p>
        <h2 className={style.confirm}>Compra confirmada</h2>
        {successfulPurchase === "waiting" && <h3>Procesando pago...</h3>}
        {successfulPurchase === "bought" && <h3>Gracias por tu compra!</h3>}
        {successfulPurchase === "error" && <h3>Hubo un error en tu compra</h3>}
        <h3 className={style.redi}>Serás redirigido a tu perfil en unos segundos</h3>
      </div>
    </>
  );
};