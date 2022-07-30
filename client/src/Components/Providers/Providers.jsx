import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import { filterByProviderService, getProviders, sortByProviderPrice } from "../../redux/actions/ownProvActions";
import NavBarShop from '../NavBar/NavBarShop';
import ProvidersCard from "./ProvidersCard";
import NoResults from '../../Views/Profile/NoResultsProviders';
import Paginated from '../Paginated';
import Footer from "../Footer/Footer";
import inContainer from "../GlobalCss/InContainer.module.css";
import styles from "../Providers/Providers.module.css";

export default function Providers() {
    const dispatch = useDispatch();
    const { user } = useAuth0();
    const [reviews, setReviews] = useState([]);
    const [valueService, setValueService] = useState('service');
    const [valuePrice, setValuePrice] = useState('price');

    useEffect(() => {
        dispatch(getProviders());
        axios.get('https://proyecto-grupal.herokuapp.com/reviews').then(r => setReviews(r.data));
    }, [dispatch]);

    const providers = useSelector(state => state.filteredProviders);

    useEffect(() => {
        setCurrentPage(1);
    }, [providers])

    const [currentPage, setCurrentPage] = useState(1);
    const initialStateProvidersPerPage = 12;
    const [providersPerPage, setProvidersPerPage] = useState(initialStateProvidersPerPage);
    const indexOfLastProvider = currentPage * providersPerPage;
    const indexOfFirstProvider = indexOfLastProvider - providersPerPage;
    const currentProviders = providers?.slice(indexOfFirstProvider, indexOfLastProvider);
    const paginated = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    function handleFilterService(e) {
        dispatch(filterByProviderService(e.target.value));
        setValueService(e.target.value);
        setCurrentPage(1);
    };

    function handleOrderPrice(e) {
        dispatch(sortByProviderPrice(e.target.value));
        setValuePrice(e.target.value);
        setCurrentPage(1);
    };

    function handleRemove(e) {
        e.preventDefault();
        dispatch(getProviders());
        setValueService('service');
        setValuePrice('price');
    };

    return (
        <div>
            <NavBarShop />
            <section className={inContainer.container}>
                <NavLink to="/inicio">
                    <img
                        src="/assets/img/arrow-left.svg"
                        alt=""
                        className={styles.leftArrow}
                    />
                </NavLink>
                <h1 className={styles.providersTitle}>¡Conocé a nuestros yumpis!</h1>
                <div className={styles.providersFlex}>
                    <div className={styles.providersFilters}>
                        <section className={styles.selects}>
                            <p className={styles.filterTitle}>Filtrar por Servicio</p>
                            <select className={styles.select} value={valueService} onChange={(e) => handleFilterService(e)}>
                                <option value="service" disable selected>Servicio</option>
                                <option value="hospedaje">Hospedaje</option>
                                <option value="paseo">Paseo</option>
                            </select>
                        </section>
                        <br />
                        <section className={styles.selects}>
                            <p className={styles.filterTitle}>Ordenar por Precio</p>
                            <select className={styles.select} value={valuePrice} onChange={handleOrderPrice}>
                                <option value="price" disabled selected>Precio</option>
                                <option value="ASC">Menor a mayor</option>
                                <option value="DESC">Mayor a menor</option>
                            </select>
                        </section>
                        <br />
                        <button className='secondaryButton' onClick={handleRemove}>Limpiar filtros</button>
                    </div>
                    <div className={styles.providersGrid}>
                        {!currentProviders.length ? <NoResults /> :
                            currentProviders.map((p, g) => {
                                let stars = 5
                                let providerEvaluations = reviews.filter(r => r.provider.email === p.email);
                                providerEvaluations = providerEvaluations.map(pe => pe.review)
                                let numberEvaluations = providerEvaluations.length
                                providerEvaluations = providerEvaluations.reduce((x, y) => x + y, 0)
                                stars = (providerEvaluations / numberEvaluations);
                                return p.email === user.email ? null :
                                    <ProvidersCard key={p.id}
                                        name={p.name}
                                        lastName={p.lastName}
                                        email={p.email}
                                        profilePicture={p.profilePicture ? p.profilePicture : "/assets/img/notloged.png"}
                                        price={p.price}
                                        service={p.service}
                                        stars={stars ? stars : 0} />
                            })}
                    </div>
                </div>
                <div className={styles.paginado}>
                    <Paginated itemsPerPage={providersPerPage} items={providers.length} paginated={paginated} currentPage={currentPage} />
                </div>
            </section>
            <Footer />
        </div>
    );
};