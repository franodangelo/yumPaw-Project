import React from "react";
import { Marker } from "react-leaflet";
import { IconLocation } from "./IconLocation";

export default function Markers(props) {
    return (
        <Marker position={props.data} icon={IconLocation} />
    )
};