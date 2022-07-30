import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useFormik } from "formik";
import { Container, Form } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Swal from "sweetalert2";
import { putProvider } from "../../redux/actions/ownProvActions";
import NavBar from "../NavBar/NavBarShop";
import Footer from "../Footer/Footer";
import InContainer from "../GlobalCss/InContainer.module.css"
import styles from "./Lodging.module.css";

export default function Lodging() {
  const dispatch = useDispatch();
  const { user } = useAuth0();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: user.email,
      name: user.given_name,
      lastName: user.family_name,
      typeOfHousing: "",
      price: "",
      dogsPerWalk: "",
      description: ""
    },

    onSubmit: (formData) => {
      Swal.fire({
        title: '¿Estás seguro que querés guardar los cambios?',
        showDenyButton: true,
        denyButtonText: `Cancelar`,
        confirmButtonText: 'Guardar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          dispatch(putProvider(formData));
          Swal.fire('¡Los cambios fueron guardados con éxito!', '', 'success')
          dispatch(putProvider(formData));
          navigate('/mi-perfil')
        } else if (result.isDenied) {
          Swal.fire('Los cambios no fueron guardados.', '', 'info')
        }
      })
    }
  });

  const categoriesOptions = [
    { key: "casa", value: "casa", text: "casa" },
    { key: "departamento", value: "cepartamento", text: "departamento" },
    { key: "quinta", value: "quinta", text: "quinta" }
  ];
  
  return (
    <div>
      <NavBar />
      <div className={InContainer.container}>
        <NavLink to="/servicio">
          <img
            src="/assets/img/arrow-left.svg"
            alt=""
            className={styles.leftArrow}
          />
        </NavLink>
        <Container>
          <div className={styles.container}>
            <h2>Contanos más acerca de lo que ofrecés</h2>
            <Form onSubmit={formik.handleSubmit}>
              <Form.Dropdown
                placeholder="¿En qué tipo de vivienda vivís?"
                options={categoriesOptions}
                onChange={(e) => {
                  e.target.value = e.target.textContent;
                  e.target.name = "typeOfHousing";
                  formik.handleChange(e);
                }}
                selection={true}
                error={formik.errors.size}
              ></Form.Dropdown>
              <Form.Input
                type="number"
                placeholder="¿Cuál es la cantidad máxima de mascotas que podés hospedar?"
                name="dogsPerWalk"
                onChange={formik.handleChange}
              ></Form.Input>
              <Form.Input
                type="number"
                placeholder="Indicanos un precio por hora"
                name="price"
                onChange={formik.handleChange}
              ></Form.Input>
              <Form.Input
                type="text"
                placeholder="Ahora... ¡contanos por qué deberían elegirte!"
                name="description"
                onChange={formik.handleChange}
              ></Form.Input>
              <br />
              <br />
              <div>
                <Link to='/mi-perfil'><button className="secondaryButton">Cancelar</button></Link>
                <button className="primaryButton" type="submit">Confirmar</button>
              </div>
            </Form>
          </div>
        </Container>
      </div>
      <Footer />
    </div>
  );
}
