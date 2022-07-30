import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

export default function UserType() {
    const { user } = useAuth0();
    const navigate = useNavigate();
    const ownerRegister = async () => {
        let owner = {
            email: user.email,
            name: user.given_name,
            lastName: user.family_name
        }
        await axios.post('https://proyecto-grupal.herokuapp.com/owners', owner);
        navigate('/inicio');
    }
    return (
        <div>
            {ownerRegister()}
        </div>
    )
};