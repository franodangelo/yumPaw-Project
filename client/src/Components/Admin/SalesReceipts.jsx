import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSales } from "../../redux/actions/ownProvActions";
import NavBar from "../NavBar/NavBarShop";
import Footer from "../Footer/Footer";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Button from "@material-ui/core/Button";
import style from "./AdminDashboard.module.css";

export default function SalesReceipts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const solds = useSelector((state) => state.solds);

  useEffect(() => {
    dispatch(getSales());
  }, [dispatch]);


  function detail(id) {
    localStorage.setItem("idProduct", id);
    navigate(`/admin/ventas-petshop/${id}`);
  }

  const columns = [
    { field: "id", headerName: "ID de la compra", minWidth: 200 },
    { field: "name", headerName: "Nombre", minWidth: 150 },
    { field: "lastName", headerName: "Apellido", minWidth: 150 },
    { field: "transaction_amount", headerName: "Valor total", minWidth: 150 },
    { field: "date_created", headerName: "Fecha de compra", minWidth: 230 },
    { field: "status", headerName: "Estado", minWidth: 150 },
    {
      field: "Detalle",
      renderCell: (cellValues) => {
        return (
          <Button onClick={() => detail(cellValues.id)}>Detalle</Button>
        )
      }
    }
  ];

  const rows = solds.map((so) => {
    return {
      id: so.id,
      name: so.first_name,
      lastName: so.last_name,
      transaction_amount: so.transaction_amount,
      date_created: so.date_created,
      status: so.status
    };
  });

  function back() {
    navigate('/admin');
  }

  return (
    <>
      <NavBar />
      <div className={style.contenedor}>
        <Table stickyHeader aria-label="sticky table">
          <TableRow stickyHeader aria-label="sticky table">
            <TableCell align="center" colSpan={7}>Transacciones efectuadas en la plataforma</TableCell>
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
  );
};