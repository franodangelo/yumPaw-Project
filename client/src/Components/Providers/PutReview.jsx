import React from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useFormik } from "formik";
import * as yup from "yup";
import Swal from "sweetalert2";
import { Container, Form } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import NavBar from "../NavBar/NavBarShop";
import Footer from "../Footer/Footer";
import InContainer from "../GlobalCss/InContainer.module.css"
import style from "./Star.module.css";

export default function PutReview() {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const { id } = useParams();
  const [getEmail] = useSearchParams();

  const formik = useFormik({
    initialValues: {
      id,
      message: "",
      providerEmail: getEmail.get("providerEmail"),
      OwnerName: user.given_name,
      review: '',
      ownerEmail: user.email
    },
    validationSchema: yup.object({
      message: yup.string().required('Este es un campo requerido')
    }),

    onSubmit: async (formData) => {
      formData = {
        ...formData
      };
      Swal.fire({
        title: '¿Estás seguro que querés modificar tu reseña?',
        showDenyButton: true,
        denyButtonText: `Cancelar`,
        confirmButtonText: 'Modificar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire('¡Tu reseña fue modificada con éxito!', '', 'success');
          await axios.put('https://proyecto-grupal.herokuapp.com/reviews', formData);
          navigate('/inicio');
        } else if (result.isDenied) {
          Swal.fire('La modificación no fue guardada.', '', 'info');
        }
      })
    }
  });

  return (
    <div>
      <NavBar />
      <div className={InContainer.container}>
        <NavLink to="/calificacionesOwner">
          <img
            src="/assets/img/arrow-left.svg"
            alt=""
            className={style.leftArrow}
          />
        </NavLink>
        <Container>
          <div className={style.container}>
            <h2>Modificá tu reseña</h2>
            <Form onSubmit={formik.handleSubmit}>
              <Form.Input
                type="text"
                placeholder="Contanos un poco más"
                name="message"
                onChange={formik.handleChange}
                error={formik.errors.message}
              ></Form.Input>
              <button className={style.star}
                onClick={() => { formik.values.review = 1 }}
                value='1' name="review">{formik.values.review >= 1 ? '★' : '☆'}</button>
              <button className={style.star}
                onClick={() => { formik.values.review = 2 }}
                value='2'>{formik.values.review >= 2 ? '★' : '☆'}</button>
              <button className={style.star}
                onClick={() => { formik.values.review = 3 }}
                value='3'>{formik.values.review >= 3 ? '★' : '☆'}</button>
              <button className={style.star}
                onClick={() => { formik.values.review = 4 }}
                value='4'>{formik.values.review >= 4 ? '★' : '☆'}</button>
              <button className={style.star}
                onClick={() => { formik.values.review = 5 }}
                value='5'>{formik.values.review === 5 ? '★' : '☆'}</button>
              <button className="primaryButton" type="submit">Modificar</button>
            </Form>
          </div>
        </Container>
      </div>
      <Footer />
    </div>
  );
};
