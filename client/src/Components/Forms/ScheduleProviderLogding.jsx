import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Container, Form } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import NavBar from "../NavBar/NavBarShop";
import Footer from "../Footer/Footer";
import style from "./Star.module.css";

export default function ScheduleProviderLogdifBetweenDatesalseng() {
  const { user } = useAuth0();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [workDays, setWorkDays] = useState([]);

  const onChangeDatePicker = (date) => {
    setStartDate(date[0]);
    setEndDate(date[1] ? date[1] : null);
    if (date[0] && date[1]) {
      var pickedDates = [];
      const passedByDays = substractDates(date[0].toLocaleString().split(' ')[0], date[1].toLocaleString().split(' ')[0]);
      const initialDate = substractDates(new Date().toLocaleString().split(' ')[0], date[0].toLocaleString().split(' ')[0]);
      for (var x = 0; x < passedByDays + 1; x++) {
        pickedDates.push(addDays(new Date(), initialDate + x));
      }
    }
    if (pickedDates) {
      setWorkDays([...workDays, pickedDates]);
    }
  }

  const substractDates = function (f1, f2) {
    var aDate1 = f1.split('/');
    var aDate2 = f2.split('/');
    var fDate1 = Date.UTC(aDate1[2].slice(0, 4), aDate1[1] - 1, aDate1[0]);
    var fDate2 = Date.UTC(aDate2[2].slice(0, 4), aDate2[1] - 1, aDate2[0]);
    var difBetweenDates = fDate2 - fDate1;
    var days = Math.floor(difBetweenDates / (1000 * 60 * 60 * 24));
    return days;
  }

  function addDays(date, days) {
    let newDate = date;
    newDate.setDate(newDate.getDate() + days);
    return newDate.toLocaleString().split(' ')[0];
  }

  const formik = useFormik({
    initialValues: {
      schedule: []
    },
    validationSchema: yup.object({
    }),
    onSubmit: async (formData) => {
      formData = {
        providerEmail: user.email,
        schedule: workDays.reduce((x, y) => x.concat(y))
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
    }
  });

  const deleteRange = (range) => {
    let newWorkDays = workDays.filter(wd => wd !== range);
    setWorkDays(newWorkDays);
  }

  return (
    <div>
      <NavBar />
      <Container>
        <div className={style.container}>
          <h2>Agregá un horario de trabajo</h2>
          <Form onSubmit={formik.handleSubmit}>
            <DatePicker
              selected={startDate}
              onChange={onChangeDatePicker}
              startDate={startDate}
              endDate={endDate}
              minDate={new Date()}
              showDisabledMonthNavigation
              selectsRange
              inline
            />
            {workDays ? workDays.map(wd => {
              if (wd && wd.length) return (
                <div>
                  <p>{wd[0]} - {wd[wd.length - 1]}</p>
                  <input type='button' onClick={() => deleteRange(wd)} value='wd'></input>
                </div>
              )
            }) : null}
            <button className="primaryButton" type="submit">Enviar</button>
          </Form>
        </div>
      </Container>
      <Footer />
    </div>
  );
};