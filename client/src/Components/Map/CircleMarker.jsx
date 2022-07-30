import React from "react";
import { Circle } from "react-leaflet";

export default function CircleMarker(props) {
    return (
        <Circle center={[props.data.lat, props.data.lng]} radius={1000} />
    )
};