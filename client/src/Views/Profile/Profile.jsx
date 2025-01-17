import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import Swal from "sweetalert2";
import { getPets } from "../../redux/actions/ownProvActions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from "date-fns";
import NavBarShop from "../../Components/NavBar/NavBarShop";
import Footer from "../../Components/Footer/Footer";
import InContainer from "../../Components/GlobalCss/InContainer.module.css";
import styleContainer from "../../Components/GlobalCss/InContainer.module.css";
import style from "./Profile.module.css";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUser] = useState({});
  const [isProvider, setIsProvider] = useState(false);
  const [providerInfo, setProviderInfo] = useState();
  const [eventsProvider, setEventsProvider] = useState();
  const [eventsOwner, setEventsOwner] = useState();
  const [ableDays, setAbleDays] = useState([]);
  const pets = useSelector((state) => state.pets);

  useEffect(() => {
    if (user) {
      axios
        .get(
          "https://proyecto-grupal.herokuapp.com/providers?filter=&order=ASC"
        )
        .then((info) => {
          let data = info.data.find(u => u.email === user.email);
          if (data && data.schedule) {
            setAbleDays(data.schedule);
          }
        });
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      axios
        .get("https://proyecto-grupal.herokuapp.com/owners")
        .then(u => {
          const userDb = u.data.find(u => u.email === user.email);
          setUser({
            nombre: user.name,
            picture:
              userDb && userDb.profilePicture && userDb.profilePicture[0]
                ? userDb.profilePicture[0]
                : "/assets/img/notloged.png",
            email: user.email,
            pets: userDb ? userDb.pets : [],
            address: userDb.address,
            isAdmin: userDb.isAdmin
          });
        })
        .then(() => {
          return axios.get("https://proyecto-grupal.herokuapp.com/events");
        })
        .then(e => {
          setEventsOwner(e.data.filter(e => e.ownerEmail === user.email));
          setEventsProvider(
            e.data.filter(e => e.providerEmail === user.email)
          );
        });
    }
  }, [user, isAuthenticated, pets, dispatch]);

  useEffect(() => {
    if (user) {
      axios
        .get(
          "https://proyecto-grupal.herokuapp.com/providers?filter=&order=ASC"
        )
        .then(p => {
          let providerCheck = p.data.find(p => p.email === user.email);
          if (providerCheck) {
            setIsProvider(true);
          }
          if (providerCheck && providerCheck.service[0] === "paseo") {
            providerCheck = {
              ...providerCheck,
              schedule: providerCheck.schedule.map(p => JSON.parse(p))
            };
            setIsProvider(true);
            setProviderInfo(providerCheck);
          } else if (providerCheck && providerCheck.service[0] === "hospedaje");
          setProviderInfo(providerCheck);
        });
    }
  }, [user]);
  async function byePet(id) {
    await axios.delete(`https://proyecto-grupal.herokuapp.com/pets/${id}`, {
      isActive: false,
    });
    dispatch(getPets());
  }
  function myServices() {
    navigate("/mis-servicios");
  }
  return (
    <main>
      <NavBarShop />
      <div className={styleContainer.container}>
        <div className={InContainer.container}>
          <section className={style.infoProfile}>
            <img src={userData.picture} alt="profilePicture" />
            <article className={style.profile}>
              <div className={style.editarperfil}>
                <Link to="/mis-datos">
                  <button className="terciaryButton">Editar perfil</button>
                </Link>
              </div>
              <div className={style.textContent}>
                <h1 className={style.name}>{user.name}</h1>
              </div>
              <h4 className={style.email}>
                {" "}
                E-mail: <span className={style.span}>{user.email}</span>
              </h4>
              <h4 className={style.address}>
                Dirección:{" "}
                <span className={style.span}>
                  {userData.address ? userData.address.road : null},{" "}
                  {userData.address ? userData.address.state : null},{" "}
                  {userData.address ? userData.address.city : null}
                </span>{" "}
              </h4>
              <div className={style.buttonContainer}>
                <div className={style.service}>
                  <Link to="/compras-realizadas">
                    <button className="secondaryButton">Mis compras</button>
                  </Link>
                </div>
                <div className={style.service}>
                  <Link to="/calificaciones-dueno">
                    <button className="secondaryButton">Reseñas enviadas</button>
                  </Link>
                </div>
                {isProvider && (
                  <div className={style.service}>
                    <Link to="/calificaciones-yumpis">
                      <button className="primaryButton">Reseñas recibidas</button>
                    </Link>
                  </div>
                )}
                {
                  <div className={style.service}>
                    <button className="primaryButton" onClick={myServices}>Servicios contratados</button>
                  </div>
                }
                {!isProvider && (
                  <div className={style.service}>
                    <Link to="/servicio">
                      <button className="primaryButton">Ofrecer servicio</button>
                    </Link>
                  </div>
                )}
              </div>
            </article>
          </section>
          {providerInfo &&
            providerInfo.schedule &&
            providerInfo.service[0] === "hospedaje" && (
              <section className={style.mainInfoProfile}>
                <div>
                  <h2 className={style.dayTitle} style={{ display: "block" }}>Mis días de trabajo</h2>
                  <DatePicker
                    includeDates={
                      ableDays && ableDays.length
                        ? ableDays.map(ad => {
                          const dayTemp = ad.split("/")[0];
                          const monthTemp = ad.split("/")[1];
                          let newDate = ad.split("/");
                          newDate[0] = monthTemp;
                          newDate[1] = dayTemp;
                          return addDays(new Date(newDate.join("/")), 0);
                        })
                        : []
                    }
                    inline
                  />
                  <Link to="/mis-horarios-hospedaje">
                    <button className="terciaryButton">Editar horarios</button>
                  </Link>
                </div>
              </section>
            )}
          {providerInfo && providerInfo.service[0] === "hospedaje" && (
            <div>
              <h3 className={style.hogar}>Mi hogar</h3>
              <div className={style.buttonPhoto}>
                <input
                  className="primaryButton"
                  type="button"
                  value="Agregar Foto"
                  onClick={() => navigate("/agregar-foto")}
                />
              </div>
              <div className={style.housingGrid}>
                {providerInfo.housingPhotos &&
                  providerInfo.housingPhotos.map((x, y) => {
                    return (
                      <img src={x} key={y} alt={y} className={style.housePhoto} />
                    );
                  })}
              </div>
            </div>
          )}
          {providerInfo &&
            providerInfo.schedule &&
            providerInfo.service[0] === "paseo" && (
              <section className={style.mainInfoProfile}>
                <h2 style={{ display: "block" }}>Mis días de trabajo</h2>
                <div>
                  {providerInfo.schedule[0] &&
                    providerInfo.schedule[0].lunes &&
                    providerInfo.schedule[0].lunes.map(p => (
                      <div>
                        <h3>Lunes</h3>
                        <p>{p}</p>
                      </div>
                    ))}
                </div>
                <div>
                  {providerInfo.schedule[1] &&
                    providerInfo.schedule[1].martes &&
                    providerInfo.schedule[1].martes.map(p => (
                      <div>
                        <h3>Martes</h3>
                        <p>{p}</p>
                      </div>
                    ))}
                </div>
                <div>
                  {providerInfo.schedule[2] &&
                    providerInfo.schedule[2].miercoles &&
                    providerInfo.schedule[2].miercoles.map(p => (
                      <div>
                        <h3>Miercoles</h3>
                        <p>{p}</p>
                      </div>
                    ))}
                </div>
                <div>
                  {providerInfo.schedule[3] &&
                    providerInfo.schedule[3].jueves &&
                    providerInfo.schedule[3].jueves.map(p => (
                      <div>
                        <h3>Jueves</h3>
                        <p>{p}</p>
                      </div>
                    ))}
                </div>
                <div>
                  {providerInfo.schedule[4] &&
                    providerInfo.schedule[4].viernes &&
                    providerInfo.schedule[4].viernes.map(p => (
                      <div>
                        <h3>Viernes</h3>
                        <p>{p}</p>
                      </div>
                    ))}
                </div>
                <div>
                  {providerInfo.schedule[5] &&
                    providerInfo.schedule[5].sabado &&
                    providerInfo.schedule[5].sabado.map(p => (
                      <div>
                        <h3>Sabado</h3>
                        <p>{p}</p>
                      </div>
                    ))}
                </div>
                <div>
                  {providerInfo.schedule[6] &&
                    providerInfo.schedule[6].domingo &&
                    providerInfo.schedule[6].domingo.map(p => (
                      <div>
                        <h3>Domingo</h3>
                        <p>{p}</p>
                      </div>
                    ))}
                </div>
                <Link to="/mis-horarios">
                  <button className="primaryButton">Editar horarios</button>
                </Link>
              </section>
            )}
          <section className={style.petSection}>
            <div className={style.addPet}>
              <h2 className={style.boxLabel}>Mis mascotas</h2>
            </div>
            <article className={style.petsProfile}>
              {userData.pets && userData.pets.length > 0
                ? userData.pets.map((u, k) => {
                  if (x.isActive) {
                    return (
                      <div className={style.petInfo} key={k}>
                        <div className={style.profilePictureCont}>
                          <img
                            src={u.profilePicture}
                            alt="profilePicture"
                            className={style.profilePicture}
                          />
                        </div>
                        <div className={style.petData}>
                          <h2 className={style.titulo}>{u.name}</h2>
                          <h4 className={style.race}>
                            {" "}
                            Raza: <span className={style.span}>{u.race}</span>
                          </h4>
                          <p className={style.aboutDog}>
                            Sobre {u.name}:{" "}
                            <span className={style.span}>{u.description}</span>
                          </p>
                        </div>
                        <button
                          className="secondaryButton"
                          onClick={() => {
                            Swal.fire({
                              title:
                                "¿Estás seguro que querés eliminar a esta mascota?",
                              showDenyButton: true,
                              confirmButtonText: "Eliminar",
                              denyButtonText: `Cancelar`
                            }).then(async (result) => {
                              if (result.isConfirmed) {
                                Swal.fire(
                                  "¡La mascota fue eliminada!",
                                  "",
                                  "success"
                                );
                                byePet(u.id);
                              } else if (result.isDenied) {
                                Swal.fire("", "", "info");
                              }
                            });
                          }}
                        >
                          X
                        </button>
                      </div>
                    );
                  }
                })
                : null}
              <Link to="/agregar-mascota">
                <button className="primaryButton">Agregar mascota</button>
              </Link>
            </article>
          </section>
          <section>
            <div className={style.addPet}></div>
            <article className={style.petsProfile}>
              {userData.pets && userData.pets.length > 0
                ? userData.pets.map(u => {
                  if (u.isActive) {
                    return (
                      <div>
                        <h3>Mascota: {u.petName}</h3>
                        <h4>{u.eventType} con {u.providerName}</h4>
                        <p>Fecha del evento: {u.date.day} {u.date.realDate} -{" "}{u.date.hour}</p>
                      </div>
                    );
                  }
                })
                : null}
              {isProvider && (
                <div>
                  <h2>Mis servicios acordados</h2>
                </div>
              )}
            </article>
            {isProvider && eventsProvider
              ? eventsProvider.map(e => {
                return (
                  <div>
                    <h3>{e.eventType} acordado con {e.ownerName}</h3>
                    <p>Mascota: {e.petName}</p>
                    <p>Fecha del evento: {e.date.day} {e.date.realDate} -{" "}{e.date.hour}</p>
                  </div>
                );
              })
              : null}
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
};
