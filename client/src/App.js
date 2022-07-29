import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

import Landing from "./Components/Landing/Landing";
import Shop from "./Components/Shop/Shop";
import { UserType } from "./Components/Landing/FlujoRegistro/UserType";
import Home from "./Components/Home/Home";
import AddPet from "./Components/Forms/AddPet";
import InfoProvider from "./Components/Forms/InfoProvider";
import InfoOwner from "./Components/Forms/InfoOwner";
import Walk from "./Components/Forms/Walk";
import Lodging from "./Components/Forms/Lodging";
import Review from "./Components/Forms/Review";
import MapView from "./Components/Map/MapView";
import GeoLocProvider from "./Components/Map/GeoLocProvider";
import SalesReceipts from "./Components/Admin/SalesReceipts";
import PostProducts from "./Components/Admin/PostProducts";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import Ratings from "./Components/Providers/Ratings";
import RatingsOwner from "./Components/Providers/RatingsOwner";
import PutReview from "./Components/Providers/PutReview";
import ProductDetail from "./Components/Shop/ProductDetail";
import CartConfirmation from "./Components/Shop/MercadoPago/CartConfirmation";
import ReserveConfirmation from "./Components/Providers/MercadoPago/ReserveConfirmation";
import PurchaseConfirmation from "./Components/Shop/MercadoPago/PurchaseConfirmation";
import ShoppingCart from "./Components/ShoppingCart/ShoppingCart";
import Providers from "./Components/Providers/Providers";
import DetailProvider from "./Components/Providers/DetailProvider";
import CheckoutBooking from "./Components/Providers/CheckoutBooking";
import Loader from "./Components/Loading/Loader";
import Chat from "./Components/Chat/Chat";
import Favorites from "./Components/Favorites/Favorites";
import Profile from "./Views/Profile/Profile.jsx";
import About from "./Views/Profile/About/About.jsx";
import Contact from "./Views/Profile/Contact/Contact.jsx";
import ScheduleProvider from "./Components/Forms/scheduleProvider";
import ScheduleProviderLodging from "./Components/Forms/ScheduleProviderLodging";
import BookingLodging from "./Components/Providers/BookingLodging";
import BookingWalk from "./Components/Providers/BookingWalk";
import UsersTable from "./Components/Admin/UsersTable";
import ProductsList from "./Components/Admin/ProductsList";
import PutProduct from "./Components/Admin/PutProduct";
import PurchasesMade from "./Components/Shop/PurchasesMade";
import AdminProfile from "./Views/Profile/AdminProfile";
import AddHousingPhoto from "./Components/Forms/AddHousingPhoto";
import SaleDetail from "./Components/Admin/SaleDetail";
import OfferedServicesDetail from "./Components/Admin/OfferedServicesDetail";
import HiredServicesDetail from "./Components/Admin/HiredServicesDetail";
import PaymentBookingCheckout from "./Components/Providers/PaymentBookingCheckout";
import Banned from "./Views/Profile/Banned";
import PendingMessages from "./Components/Chat/PendingMessages";
import "./App.css";

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const searchUser = () => {
      axios.get("https://proyecto-grupal.herokuapp.com/owners").then((res) => {
        let resp = res.data.find((x) => x.email === user.email);
        if (resp) {
          setIsAdmin(resp.isAdmin);
          setIsBanned(resp.isBanned);
          setFinished(true);
        }
      });
    };
    if (user) {
      searchUser();
    }
  }, [user]);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/mapa" element={<MapView/>} />
          <Route path="'/geoloc-yumpi" element={<GeoLocProvider/>} />
          <Route path="/inicio"
            element={ isAuthenticated && isBanned ? <Banned/> : !isLoading ? <Home/> : <Loader/>}
          />
          <Route path="/nosotros" element={<About/>} />
          <Route path="/contacto" element={<Contact/>} />
          <Route path="/shop" 
            element={isBanned ? <Banned/> : !isLoading ? <Shop/> : <Loader/>}
          />
          <Route path="/shop/:id"
            element={!isLoading ? <ProductDetail/> : <Loader/>}
          />
          <Route path="/agregar-mascota"
            element={isAuthenticated && isBanned ? <Banned/> : !isLoading ? <AddPet/> : <Loader/>}
          />
          <Route path="/tipo-usuario"
            element={isAuthenticated && !isLoading ? <UserType/> : <Loader/>}
          />
          <Route path="/mi-perfil"
            element={isAuthenticated && isBanned ? <Banned/> : !isLoading ? <Profile/> : <Loader/>}
          />
          <Route path="/admin"
            element={isAuthenticated && !isLoading ? <AdminProfile/> : <Loader/>}
          />
          <Route path="/servicio"
            element={isAuthenticated && isBanned ? <Banned/> : !isLoading ? <InfoProvider/> : <Loader/>}
          />
          <Route path="/yumpis"
            element={isAuthenticated && isBanned ? <Banned/> : !isLoading ? <Providers/> : <Loader/>}
          />
          <Route path="/yumpis/:name"
            element={isAuthenticated && isBanned ? <Banned/> : !isLoading ? <DetailProvider/> : <Loader/>}
          />
          <Route path="/chat/:providerEmail/:ownerEmail"
            element={isAuthenticated && isBanned ? <Banned/> : !isLoading ? <Chat/> : <Loader/>}
          />
          <Route path="/mensajes-pendientes"
            element={isAuthenticated && isBanned ? (<h1>baneado</h1>) : !isLoading ? <PendingMessages/> : <Loader/>}
          />
          <Route path="/favoritos"
            element={isAuthenticated && !isLoading ? <Favorites/> : <Loader/>}
          />
          <Route path="/mis-datos"
            element={isAuthenticated && !isLoading ? <InfoOwner/> : <Loader/>}
          />
          <Route path="/agregar-foto"
            element={isAuthenticated && !isLoading ? <AddHousingPhoto/> : <Loader/>}
          />
          <Route path="/resena/:providerEmail"
            element={isAuthenticated && isBanned ? <Banned/> : !isLoading ? <Review/> : <Loader/>}
          />
          <Route path="/mi-carrito" element={<ShoppingCart/>} />
          <Route path="/confirmacion"
            element={isAuthenticated && !isLoading ? <CartConfirmation/> : <Loader/>}
          />
          <Route path="/confirmation"
            element={isAuthenticated && !isLoading ? <ReserveConfirmation/> : <Loader/>}
          />
          <Route path="/purchaseConfirmation"
            element={isAuthenticated && !isLoading ? <PurchaseConfirmation/> : <Loader/>}
          />
          <Route path="/paseo"
            element={isAuthenticated && isBanned ? <Banned/> : !isLoading ? <Walk/> : <Loader/>}
          />
          <Route path="/hospedaje"
            element={isAuthenticated && isBanned ? <Banned/> : !isLoading ? <Lodging/> : <Loader/>}
          />
          <Route path="/reservar-hospedaje/:providerEmail"
            element={isAuthenticated && isBanned ? <Banned/> : !isLoading ? <BookingLodging/> : <Loader/>}
          />
          <Route path="/reservar-paseo/:providerEmail"
            element={isAuthenticated && isBanned ? <Banned/> : !isLoading ? <BookingWalk/> : <Loader/>}
          />
          <Route path="/mis-servicios"
            element={isAuthenticated && !isLoading ? <CheckoutBooking/> : <Loader/>}
          />
          <Route path="/calificaciones-yumpis"
            element={isAuthenticated && !isLoading ? <Ratings/> : <Loader/>}
          />
          <Route path="/calificaciones-dueno"
            element={isAuthenticated && !isLoading ? <RatingsOwner/> : <Loader/>}
          />
          <Route path="/cambiar-resena/:id"
            element={isAuthenticated && !isLoading ? <PutReview/> : <Loader/>}
          />
          <Route path="/mis-horarios"
            element={isAuthenticated && !isLoading ? <ScheduleProvider/> : <Loader/>}
          />
          <Route path="/mis-horarios-hospedaje"
            element={isAuthenticated && !isLoading ? <ScheduleProviderLodging /> : <Loader/>}
          />
          <Route path="/compras-realizadas"
            element={isAuthenticated && !isLoading ? <PurchasesMade/> : <Loader/>}
          />
          <Route path="/pagar-reserva"
            element={isAuthenticated && !isLoading ? <PaymentBookingCheckout/> : <Loader/>}
          />
          {/*--------------RUTAS PRIVADAS--------------------*/}
          <Route path="/admin/dashboard"
            element={user && finished ? isAdmin ? <AdminDashboard/> : <Navigate to="/home"/> : null}
          />
          <Route path="/admin/agregar-productos"
            element={user && finished ? isAdmin ? <PostProducts/> : <Navigate to="/home"/> : null}
          />
          <Route path="/admin/ventas-petshop"
            element={user && finished ? isAdmin ? <SalesReceipts/> : <Navigate to="/home"/> : null}
          />
          <Route path="/admin/ventas-petshop/"
            element={user && finished ? isAdmin ? <SalesReceipts/> : <Navigate to="/home"/> : null}
          />
          <Route path="/admin/ventas-petshop/:id"
            element={user && finished ? isAdmin ? <SaleDetail/> : <Navigate to="/home"/> : null}
          />
          <Route path="/admin/modificar-producto"
            element={user && finished ? isAdmin ? <PutProduct/> : <Navigate to="/home"/> : null}
          />
          <Route path="/admin/get-users"
            element={user && finished ? isAdmin ? <UsersTable/> : <Navigate to="/home"/> : null}
          />
          <Route path="/admin/prestacion-servicios"
            element={user && finished ? isAdmin ? <OfferedServicesDetail/> : <Navigate to="/home"/> : null}
          />
          <Route path="/admin/servicios-contratados"
            element={user && finished ? isAdmin ? <HiredServicesDetail/> : <Navigate to="/home"/> : null}
          />
          <Route path="/admin/listado-productos"
            element={user && finished ? isAdmin ? <ProductsList/> : <Navigate to="/home"/> : null}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;