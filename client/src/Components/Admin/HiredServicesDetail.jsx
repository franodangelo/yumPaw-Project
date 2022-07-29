import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getOwnerById, getEvents } from "../../redux/actions/ownProvActions";
import { cleanDetail } from "../../redux/actions/petshopActions";
import NavBar from "../NavBar/NavBarShop";
import Footer from "../Footer/Footer";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Button from "@material-ui/core/Button";
import style from "./AdminDashboard.module.css";

export default function OfferedServicesDetail() {
  const dispatch = useDispatch();
  const idUser = localStorage.getItem("idUser");
  const navigate = useNavigate();
  const events = useSelector(state => state.events);
  const owner = useSelector(state => state.owners);

  useEffect(() => {
    dispatch(getEvents());
    dispatch(getOwnerById(idUser));
  }, [dispatch]);

  useEffect(() => {
    return () => dispatch(cleanDetail());
  }, [dispatch]);

  let serviceGroup = [];
  while (events.length > 0) {
    let newArray = events.filter(x => {
      if (e.numberOfBooking === events[0].numberOfBooking) {
        return e;
      }
    })
    serviceGroup.push(newArray);
    let newEvents = events.filter(ne => ne.numberOfBooking !== events[0].numberOfBooking)
    events = newEvents;
  }

  let userEvents = serviceGroup.filter(ue => ue[0].ownerEmail === owner[0].email);

  const columns = [
    { field: "id", headerName: "ID", minWidth: 35 },
    { field: "email", headerName: "Usuario", minWidth: 175 },
    { field: "proveider", headerName: "Proveedor", minWidth: 175 },
    { field: "eventType", headerName: "Event Type", minWidth: 150 },
    { field: "petName", headerName: "Pet Name", minWidth: 150 },
    { field: "servicePrice", headerName: "Service Price", minWidth: 150 },
    { field: "paymentStatus", headerName: "Payment Status", minWidth: 150 },
    { field: "idPayment", headerName: "Payment ID", minWidth: 150 }
  ]

  const rows = userEvents.map(ev => {
    return {
      id: ev[0].numberOfBooking,
      email: ev[0].ownerEmail,
      proveider: ev[0].providerEmail,
      eventType: ev[0].eventType,
      petName: ev[0].petName,
      servicePrice: ev[0].price * ev.length,
      paymentStatus: ev[ev.length - 1].payment,
      idPayment: ev[ev.length - 1].idMP ? ev[ev.length - 1].idMP : 'pending'
    }
  })

  function back() {
    navigate('/admin/get-users');
  }

  return (
    <>
      <NavBar />
      <div className={style.contenedor}>
        <Table stickyHeader aria-label="sticky table">
          <TableRow stickyHeader aria-label="sticky table">
            <TableCell align="center" colSpan={7}>Servicios contratados</TableCell>
          </TableRow>
        </Table>
        <div style={{ height: 375, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
        </div>
        <Button onClick={back}>Volver</Button>
      </div>
      <Footer />
    </>
  )
}