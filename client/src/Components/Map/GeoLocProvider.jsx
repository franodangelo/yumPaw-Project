import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function GeoLocProvider() {

    const [state, setState] = useState({
        latitude: 0,
        longitude: 0
    });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
            },
            {
                enableHighAccuracy: true
            }
        )
    }, []);

    return (
        <div>
            <h2>Geolocalización</h2>
            <p>Latitud:{state.latitude}</p>
            <p>Longitud:{state.longitude}</p>
            <Link to={"/mapa"} 
                state={{latitude: state.latitude, longitude: state.longitude}}>
                    Ver mi ubicación
            </Link>
        </div>
    )
};