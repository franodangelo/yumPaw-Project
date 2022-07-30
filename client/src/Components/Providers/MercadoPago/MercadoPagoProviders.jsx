import React, { useEffect, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { fetchCTokenProvider } from "../MercadoPago/fetchmetodProvider";
const FORM_ID = "payment-form";

export default function MercadoPagoProviders({ id, eventType, price }) {
  const { user } = useAuth0();
  localStorage.setItem("id", id);

  const getPreference = useCallback(async () => {
    const res = await fetchCTokenProvider(
      `events/checkout/`,
      { id, eventType, price, user: user },
      "POST"
    );

    if (res.global) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "https://www.mercadopago.com.ar/integrations/v1/web-payment-checkout.js";
      script.setAttribute("data-preference-id", res.global);
      const form = document.getElementById(FORM_ID);
      form.appendChild(script);
    }
  }, []);

  useEffect(() => {
    getPreference();
  }, [getPreference]);

  return <form id={FORM_ID} method="GET" />;
}