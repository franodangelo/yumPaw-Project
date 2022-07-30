import React, { useEffect, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import socket from "./Socket";
import { useAuth0 } from "@auth0/auth0-react";
import NavBarShop from '../NavBar/NavBarShop';
import inContainer from "../GlobalCss/InContainer.module.css";
import styles from './Chat.module.css';

export default function Chat() {
  const { user } = useAuth0();
  const providerEmail = useParams().providerEmail;
  const ownerEmail = useParams().ownerEmail;
  const [name, setName] = useState();
  const [service, setService] = useState();
  const [mensaje, setMensaje] = useState({
    nombre: user.name,
    mensaje: ''
  });
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    axios.get('https://proyecto-grupal.herokuapp.com/providers?filter=&order=ASC').then(x => {
      const mame = x.data.find(x => x.email === providerEmail);
      setName(`${mame.name} ${mame.lastName}`);
      setService(mame.service[0]);
    })
  }, []);

  const almacenar = () => {
    let cache = [];
    return function (msj, addCache, renderMessages, cleanCache) {
      if (addCache) {
        cache.push(msj);
      }
      else if (renderMessages) {
        setMensajes([...cache, msj]);
      }
      if (cleanCache) {
        cache = [];
      }
    }
  }

  const sendCache = almacenar();
  useEffect(() => {
    sendCache(false, false, false, true);
    socket.emit('conectado', "Chat conectado con exito", user.email, providerEmail, ownerEmail);
    const storedMessages = localStorage.getItem(`${providerEmail}`);
    if (storedMessages) {
      setMensajes(JSON.parse(storedMessages));
    }
  }, []);

  const setMessage = (e) => {
    setMensaje({
      ...mensaje,
      mensaje: e.target.value
    })
  }

  useEffect(() => {
    socket.on('Mensaje agregado a Mensajes', (msj, caso1, caso2, caso3, lastMessageReceived) => {
      if (caso1 === true) {
        setMensajes([...mensajes, msj]);
      }
      else if (caso2) {
        setMensajes([...mensajes, msj]);
      }
      else if (caso3) {
        if (lastMessageReceived) {
          sendCache(msj, false, true, true);
        }
        else {
          sendCache(msj, true, false, false);
        }
      }
    });
    if (mensajes.length > 30) {
      mensajes.shift();
      setMensajes(mensajes);
    }
    localStorage.setItem(`${providerEmail}`, JSON.stringify(mensajes));
    return () => { socket.off() };
  }, [mensajes])
  const divRef = useRef(null);
  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: 'smooth' })
  });

  const submitMessage = (e) => {
    e.preventDefault();
    socket.emit("mensaje enviado", mensaje, providerEmail, user.email, ownerEmail)
    setMensaje({
      ...mensaje,
      mensaje: ''
    })
  }

  return (
    <div>
      <NavBarShop />
      <div className={inContainer.container}>
        <NavLink to={`/yumpis/${providerEmail}`}>
          <img src="/assets/img/arrow-left.svg" alt="back arrow" className={styles.leftArrow} />
        </NavLink>
        <h2 className={styles.titleChat}>Tu conversación con {name}</h2>
        <div className={styles.chat}>
          {mensajes.length > 0 ? mensajes.map((x, y) => {
            return (
              <p key={y}><strong className={styles.strong}>{x.nombre}:</strong> {`${x.mensaje}`}</p>
            )
          }) : null
          }
          <div ref={divRef}></div>
        </div>
        <form className={styles.form} onSubmit={submitMessage}>
          <input className={styles.placeholder} type="text" value={mensaje.mensaje} placeholder="Tu mensaje" name="message" onChange={setMessage}></input>
          <button type="submit" value="Enviar" className="primaryButton">Enviar mensaje</button>
        </form>
      </div>
    </div>
  );
};