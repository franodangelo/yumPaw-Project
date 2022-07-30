import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { Widget } from "@uploadcare/react-widget";
import Swal from "sweetalert2";
import { putProvider } from "../../redux/actions/ownProvActions";
import Footer from "../Footer/Footer";
import NavBar from "../NavBar/NavBarShop";
import InContainer from "../GlobalCss/InContainer.module.css"
import style from "./AddHousingPhoto.module.css";

export default function AddHousingPhoto() {
  const { user } = useAuth0();
  const dispatch = useDispatch();
  const [photo, setPhoto] = useState("");
  const [infoUser, setInfoUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      axios
        .get(
          "https://proyecto-grupal.herokuapp.com/providers?filter=&order=ASC"
        )
        .then(u => {
          setInfoUser(u.data.find(u => u.email === user.email));
        });
    }
  }, [user]);
  const submitPhoto = () => {
    let newInfoUser = {
      ...infoUser,
      housingPhotos:
        infoUser.housingPhotos && infoUser.housingPhotos.length
          ? [...infoUser.housingPhotos, photo]
          : [photo],
    };
    Swal.fire({
      title: "¿Estás seguro que querés agregar esta foto?",
      showDenyButton: true,
      denyButtonText: `Cancelar`,
      confirmButtonText: "Agregar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire("¡La foto fue agregada correctamente!", "", "success");
        dispatch(putProvider(newInfoUser));
        navigate("/mi-perfil");
      } else if (result.isDenied) {
        Swal.fire("La foto no fue agregada.", "", "info");
      }
    });
  };
  return (
    <div>
      <NavBar />
      <div className={style.minCont}>
        <div className={InContainer.container}>
          <div className={style.container}>
            <Widget
              publicKey="269841dc43864e62c49d"
              id="file"
              name="photos"
              onChange={(e) => {
                setPhoto(e.originalUrl);
              }}
              perrito="profilePicture"
            />
            {photo && <img src={photo}></img>}
            {photo && infoUser && (
              <input
                type="button"
                onClick={() => submitPhoto()}
                value="AGREGAR FOTO"
                className="primaryButton"
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
