import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

export default function PendingMessages() {
    const { user } = useAuth0();
    const [pendingMessagesOwner, setPendingMessagesOwner] = useState([]);
    const [pendingMessagesProvider, setPendingMessagesProvider] = useState([]);

    useEffect(() => {
        if (user) {
            axios.get('https://proyecto-grupal.herokuapp.com/providers?filter=&order=ASC').then(m => {
                let providerMessages = m.data.filter(m => {
                    return (m.pendingMessages.find(pm => pm.ownerEmail === user.email));
                })
                setPendingMessagesOwner(providerMessages);
            })
            axios.get('https://proyecto-grupal.herokuapp.com/owners').then(m => {
                let ownerMessages = m.data.filter(m => {
                    return (m.pendingMessages.find(pm => pm.providerEmail === user.email));
                })
                setPendingMessagesProvider(ownerMessages);
            })
        }
    }, [user]);

    const navigate = useNavigate();

    return (
        <div>
            <h1>Mensajes</h1>
            {pendingMessagesOwner && pendingMessagesOwner.length && <div>{pendingMessagesOwner.map(x => <input type='button' onClick={() => navigate(`/chat/${x.email}/${user.email}`)} value={x.name} />)}</div>}
            {pendingMessagesProvider && pendingMessagesProvider.length && <>{pendingMessagesProvider.map(x => <input type='button' onClick={() => navigate(`/chat/${user.email}/${x.email}`)} value={x.name} />)}</>}
        </div>
    );
};