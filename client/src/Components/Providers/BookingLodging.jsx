import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useFormik } from "formik";
import * as yup from "yup";
import { addDays } from 'date-fns';
import Swal from "sweetalert2";
import { Form } from "semantic-ui-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getEvents } from "../../redux/actions/ownProvActions";
import { cleanDetail } from "../../redux/actions/petshopActions";
import NavBar from "../NavBar/NavBarShop";
import inContainer from '../GlobalCss/InContainer.module.css';

export default function BookingLodging() {
    const dispatch = useDispatch();
    const { user } = useAuth0();
    const { providerEmail } = useParams();
    const [myInfo, setMyinfo] = useState();
    const [bookingDays, setBookingDays] = useState([]);
    const [ableDays, setAbleDays] = useState([]);
    const [maxId, setMaxId] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getEvents());
    }, []);

    useEffect(() => {
        return () => dispatch(cleanDetail());
    }, [dispatch]);

    const events = useSelector(state => state.events);

    useEffect(() => {
        if (events.length) {
            events.forEach(ev => {
                if (ev.numberOfBooking > maxId) setMaxId(ev.numberOfBooking + 1);
                else setMaxId(maxId + 1);
            })
        }
    }, [events]);

    useEffect(() => {
        axios.get('https://proyecto-grupal.herokuapp.com/providers?filter=&order=ASC').then(info => {
            let data = info.data.find(i => i.email === providerEmail);
            formik.values.providerName = data.name + ' ' + data.lastName;
            formik.values.price = data.price;
            setAbleDays(data.schedule);
        });
    }, [providerEmail]);

    const formik = useFormik({
        initialValues: {
            date: {
                day: ''
            },
            petName: '',
            eventType: 'hospedaje',
            comments: '',
            payment: 'pending',
            ownerEmail: user.email,
            providerEmail: providerEmail,
            ownerName: user.name,
            providerName: '',
            price: '',
            numberOfBooking: 0
        },
        validationSchema: yup.object({
            petName: yup.string().required('Tenés que elegir una mascota')
        }),
        onSubmit: async (formData) => {
            for (let x = 0; x < bookingDays.length; x++) {
                if (ableDays.includes(bookingDays[x])) { }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Intentaste reservar un día no disponible.'
                    })
                    navigate(`/reservar-hospedaje/${providerEmail}`);
                }
            }
            Swal.fire({
                title: '¿Estás seguro que querés confirmar esta reserva?',
                showDenyButton: true,
                denyButtonText: `Cancelar`,
                confirmButtonText: 'Confirmar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    for (let x = 0; x < bookingDays.length; x++) {
                        formData = {
                            ...formData,
                            date: {
                                day: bookingDays[x]
                            },
                            numberOfBooking: maxId
                        };
                        await axios.post("https://proyecto-grupal.herokuapp.com/events", formData);
                    }
                    Swal.fire('¡La reserva fue confirmada con éxito!', '', 'success');
                    navigate('/mis-servicios');
                } else if (result.isDenied) {
                    Swal.fire('La reserva no fue confirmada.', '', 'info');
                }
            });
            dispatch(getEvents());
        }
    });

    useEffect(() => {
        if (user) {
            axios.get('https://proyecto-grupal.herokuapp.com/owners').then(u => {
                let miInfo = u.data.find(u => u.email === user.email);
                setMyinfo(miInfo);
            });
        };
    }, [user]);

    const [petOptions, setPetOptions] = useState([]);
    useEffect(() => {
        var petOptions = [];
        if (myInfo && myInfo.pets) {
            myInfo.pets.forEach(p => petOptions.push({ key: p.name, value: p.name, text: p.name }));
        }
        setPetOptions(petOptions);
    }, [myInfo]);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const substractDates = function (f1, f2) {
        var aDate1 = f1.split('/');
        var aDate2 = f2.split('/');
        var fDate1 = Date.UTC(aDate1[2].slice(0, 4), aDate1[1] - 1, aDate1[0]);
        var fDate2 = Date.UTC(aDate2[2].slice(0, 4), aDate2[1] - 1, aDate2[0]);
        var dif = fDate2 - fDate1;
        var days = Math.floor(dif / (1000 * 60 * 60 * 24));
        return days;
    }

    const onChangeDatePicker = (date) => {
        setStartDate(date[0]);
        setEndDate(date[1] ? date[1] : null)
        if (date[0] && date[1]) {
            var selectedDates = [];
            const daysPassed = substractDates(date[0].toLocaleString().split(' ')[0], date[1].toLocaleString().split(' ')[0]);
            const fechaInicial = substractDates(new Date().toLocaleString().split(' ')[0], date[0].toLocaleString().split(' ')[0]);
            for (var x = 0; x < daysPassed + 1; x++) {
                selectedDates.push(sumarDias(new Date(), fechaInicial + x).toLocaleString().split(' ')[0]);
            }
        }
        if (selectedDates) setBookingDays(selectedDates);
    }
    function sumarDias(date, dias) {
        date.setDate(date.getDate() + dias);
        return date;
    }
    return (
        <>
            <NavBar />
            <div className={inContainer.container}>
                <Form onSubmit={formik.handleSubmit}>
                    <h2>Tu reserva</h2>
                    <label htmlFor="">Tu nombre</label>
                    <Form.Input type="text" readOnly name="name" value={user.name} onChange={formik.handleChange} />
                    <label htmlFor="">Tu mascota</label>
                    <Form.Dropdown
                        placeholder="Elegí una de tus mascotas"
                        options={petOptions}
                        onChange={(e) => {
                            e.target.value = e.target.firstChild.textContent
                            e.target.name = "petName"
                            formik.values.petName = e.target.value;
                            formik.handleChange(e);
                        }}
                        selection={true}
                        error={formik.errors.petName}
                    >
                    </Form.Dropdown>
                    <label htmlFor="">Elegí un rango de fecha para el hospedaje de tu mascota</label>
                    <DatePicker
                        selected={startDate}
                        onChange={onChangeDatePicker}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        includeDates={ableDays && ableDays.length ? ableDays.map(ad => {
                            const dayTemp = ad.split('/')[0];
                            const monthTemp = ad.split('/')[1];
                            let newDate = ad.split('/');
                            newDate[0] = monthTemp;
                            newDate[1] = dayTemp;
                            return (addDays(new Date(newDate.join('/')), 0));
                        }) : []}
                        inline
                    />
                    <h2>Fechas disponibles del yumpi</h2>
                    <label htmlFor="">Comentarios adicionales</label>
                    <textarea
                        onChange={(e) => {
                            formik.values.comments = e.target.value;
                        }}
                    ></textarea>
                    <Link to={`/providers`}><button className="secondaryButton">Cancelar</button></Link>
                    <button className="primaryButton">Continuar con el pago</button>
                </Form>
            </div>
        </>
    )
};