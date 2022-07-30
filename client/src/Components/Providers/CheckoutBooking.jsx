import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { getEvents } from "../../redux/actions/ownProvActions";
import NavBar from "../NavBar/NavBarShop";
import inContainer from "../GlobalCss/InContainer.module.css";

export default function CheckoutBooking() {
  const { user } = useAuth0();
  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch])

  let events = useSelector(state => state.events);
  let group = [];
  while (events.length > 0) {
    let newArray = events.filter(e => {
      if (e.numberOfBooking === events[0].numberOfBooking) {
        return e;
      }
    })
    group.push(newArray);
    let newEvents = events.filter(el => el.numberOfBooking !== events[0].numberOfBooking);
    events = newEvents;
  }

  let userEvents = group.filter(ev => ev[0].ownerEmail === user.email);

  function checkoutMP(el) {
    localStorage.setItem("service", JSON.stringify(el));
    navigate('/pagar-reserva');
  }

  return (
    <>
      <NavBar />
      <div className={inContainer.container}>
        <section>
          <h2>Reservas agendadas</h2>
          <br />
          {userEvents && userEvents.length ?
            userEvents.map(el => {
              return el[0].payment === 'pending' ? (
                <div>
                  <h5>Fecha - Desde: {el[0].date.day} Hasta: {el[el.length - 1].date.day}</h5>
                  <p> {el[0].date.hour ? <p>Hora: {el[0].date.hour}</p> : null}</p>
                  <p>Nombre del Yumpi: {el[0].providerName}</p>
                  <p>Tipo de servicio: {el[0].eventType}</p>
                  <p>Mascota: {el[0].petName}</p>
                  {el[el.length - 1].payment === 'pending' ? <button onClick={() => checkoutMP(el)}>PAGAR SERVICIO</button> : 'Tu servicio ya está pago :D'}
                </div>) : null
            }) : null
          }
        </section>
      </div>
    </>
  );
};