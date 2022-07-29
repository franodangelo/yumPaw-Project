import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProviderById, getEvents } from "../../redux/actions/ownProvActions";
import NavBar from "../NavBar/NavBarShop";
import Footer from "../Footer/Footer";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Button from "@material-ui/core/Button";

export default function HiredServicesDetail() {
  const dispatch = useDispatch();
  const idUser = localStorage.getItem("idUser");
  const navigate = useNavigate();
  const events = useSelector(state => state.events);
  const provider = useSelector(state => state.providers);

  useEffect(() => {
    dispatch(getEvents())
    dispatch(getProviderById(idUser))
  }, [dispatch])

  let serviceGroup = [];
  while (events.length > 0) {
    let newArray = events.filter(e => {
      if (e.numberOfBooking === events[0].numberOfBooking) {
        return e;
      }
    })
    serviceGroup.push(newArray);
    let newEvents = events.filter(el => el.numberOfBooking !== events[0].numberOfBooking);
    events = newEvents;
  }

  let userEvents = serviceGroup.filter(ev => ev[0].providerEmail === provider[0].email);

  const columns = [
    { field: "id", headerName: "ID", minWidth: 35 },
    { field: "email", headerName: "Proveedor", minWidth: 175 },
    { field: "client", headerName: "Cliente", minWidth: 175 },
    { field: "eventType", headerName: "Event Type", minWidth: 150 },
    { field: "petName", headerName: "Pet Name", minWidth: 150 },
    { field: "servicePrice", headerName: "Service Price", minWidth: 150 },
    { field: "paymentStatus", headerName: "Payment Status", minWidth: 150 },
    { field: "idPayment", headerName: "Payment ID", minWidth: 150 }
  ]

  const rows = userEvents.map((ev) => {
    return {
      id: ev[0].numberOfBooking,
      email: ev[0].providerEmail,
      client: ev[0].ownerEmail,
      eventType: ev[0].eventType,
      petName: ev[0].petName,
      servicePrice: ev[0].price * ev.length,
      paymentStatus: ev[ev.length - 1].payment,
      idPayment: ev[ev.length - 1].idMP ? ev[0].idMP : 'pending'
    }
  })

  function back() {
    navigate('/admin/get-users');
  }

  return (
    <>
      <NavBar />
      <Table stickyHeader aria-label="sticky table">
        <TableRow stickyHeader aria-label="sticky table">
          <TableCell align="center" colSpan={7}>Servicios prestados</TableCell>
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
      <Footer />
    </>
  )
};