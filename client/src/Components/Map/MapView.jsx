import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { Map, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import CircleMarker from "./CircleMarker";

export default function MapView() {
    const currentLocationProvider = state.currentLocation;
    const location = useLocation();

    const [state, setState] = useState({
        currentLocation: {
            lat: '-23.531994432597454',
            lng: '-46.63566517289605'
        },
        zoom: 14
    });

    useEffect(() => {
        if (location.state.latitude && location.state.longitude) {
            const currentLocation = {
                lat: location.state.latitude,
                lng: location.state.longitude
            }
            setState({ ...state, currentLocation })
        }
    }, [])

    return (
        <Map center={state.currentLocation} zoom={state.zoom}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <CircleMarker data={currentLocationProvider} />
        </Map>
    )
};