import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useFormik } from "formik";
import * as yup from "yup";
import "react-datepicker/dist/react-datepicker.css";
import { Container, Form } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import NavBar from "../NavBar/NavBarShop";
import Footer from "../Footer/Footer";
import Swal from "sweetalert2";
import style from "./Star.module.css";

export default function ScheduleProvider() {
  const { user } = useAuth0();
  const navigate = useNavigate();
  const [lunes, SetLunes] = useState([]);
  const [martes, SetMartes] = useState([]);
  const [miercoles, SetMiercoles] = useState([]);
  const [jueves, SetJueves] = useState([]);
  const [viernes, SetViernes] = useState([]);
  const [sabado, SetSabado] = useState([]);
  const [domingo, SetDomingo] = useState([]);

  const formik = useFormik({
    initialValues: [
      { lunes: [] },
      { martes: [] },
      { miercoles: [] },
      { jueves: [] },
      { viernes: [] },
      { sabado: [] },
      { domingo: [] }
    ],
    validationSchema: yup.object({
    }),

    onSubmit: async (formData) => {
      formData = {
        providerEmail: user.email,
        schedule: [...formData]
      };
      Swal.fire({
        title: '¿Estás seguro que querés guardar los cambios?',
        showDenyButton: true,
        denyButtonText: `Cancelar`,
        confirmButtonText: 'Guardar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire('¡Los cambios fueron guardados con éxito!', '', 'success');
          await axios.put('https://proyecto-grupal.herokuapp.com/events/schedule', formData);
          navigate('/mi-perfil');
        } else if (result.isDenied) {
          Swal.fire('Los cambios no fueron guardados.', '', 'info');
        }
      });
    },
  });

  const showInputs = (day, SetDay, stateDay, idx) => {
    return (<div>
      {stateDay.map((x, y) => {
        return (<div>
          <input type='time'
            indice={y}
            onChange={(e) => {
              formik.values[idx][day].splice(y, 1, e.target.value);
            }
            }></input>
        </div>)
      })}
      <input type='button' onClick={() => {
        let stateDayLength = stateDay.length - 1;
        if (formik.values[idx][day][stateDayLength]) {
          SetDay([...stateDay, 0]);
        }
      }} value="+" />
    </div>)
  }

  return (
    <div>
      <NavBar />
      <Container>
        <div className={style.container}>
          <h2>Agregá tu disponibilidad para trabajar</h2>
          <Form onSubmit={formik.handleSubmit}>
            <div class="ui checkbox">
              <input type="checkbox"
                name="lunes"
                onChange={() => {
                  SetLunes(['lunes'])
                }}
              />
              <label>Lunes</label>
            </div>
            <div class="ui checkbox">
              <input type="checkbox"
                name="martes"
                onChange={() => {
                  SetMartes(['martes'])
                }}
              />
              <label>Martes</label>
            </div>
            <div class="ui checkbox">
              <input type="checkbox"
                name="miercoles"
                onChange={() => {
                  SetMiercoles(['miercoles'])
                }}
              />
              <label>Miércoles</label>
            </div>
            <div class="ui checkbox">
              <input type="checkbox"
                name="jueves"
                onChange={() => {
                  SetJueves(['jueves'])
                }}
              />
              <label>Jueves</label>
            </div>
            <div class="ui checkbox">
              <input type="checkbox"
                name="viernes"
                onChange={() => {
                  SetViernes(['viernes'])
                }}
              />
              <label>Viernes</label>
            </div>
            <div class="ui checkbox">
              <input type="checkbox"
                name="sabado"
                onChange={() => {
                  SetSabado(['sabado'])
                }}
              />
              <label>Sabado</label>
            </div>
            <div class="ui checkbox">
              <input type="checkbox"
                name="domingo"
                onChange={() => {
                  SetDomingo(['domingo'])
                }}
              />
              <label>Domingo</label>
            </div>
            {lunes.length > 0 ?
              <div>
                <h3>Lunes</h3>
                {showInputs('lunes', SetLunes, lunes, 0)}
              </div> : null
            }
            {martes.length > 0 ?
              <div>
                <h3>Martes</h3>
                {showInputs('martes', SetMartes, martes, 1)}
              </div> : null
            }
            {miercoles.length > 0 ?
              <div>
                <h3>Miercoles</h3>
                {showInputs('miercoles', SetMiercoles, miercoles, 2)}
              </div> : null
            }
            {jueves.length > 0 ?
              <div>
                <h3>Jueves</h3>
                {showInputs('jueves', SetJueves, jueves, 3)}
              </div> : null
            }
            {viernes.length > 0 ?
              <div>
                <h3>Viernes</h3>
                {showInputs('viernes', SetViernes, viernes, 4)}
              </div> : null
            }
            {sabado.length > 0 ?
              <div>
                <h3>Sabado</h3>
                {showInputs('sabado', SetSabado, sabado, 5)}
              </div> : null
            }
            {domingo.length > 0 ?
              <div>
                <h3>Domingo</h3>
                {showInputs('domingo', SetDomingo, domingo, 6)}
              </div> : null
            }
            <button className="primaryButton" type="submit">Agregar</button>
          </Form>
        </div>
      </Container>
      <Footer />
    </div>
  );
};