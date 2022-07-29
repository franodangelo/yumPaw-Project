import axios from 'axios';
import {
    GET_OWNERS,
    GET_OWNER_BY_NAME,
    FILTER_BY_OWNER,
    GET_PROVIDERS,
    GET_PROVIDER_BY_ID,
    SORT_PROVIDER_PRICE,
    FILTER_PROVIDER_PRICE,
    GET_EVENTS,
    GET_PETS,
    GET_SALES,
    GET_REVIEWS,
    GET_OWNER_BY_ID,
    SELECTED_EVENT,
    GROUP_EVENTS
} from '../actions-type/ownProvActionTypes';

export function getOwners() {
    return async function (dispatch) {
        try {
            let response = await axios.get(`https://proyecto-grupal.herokuapp.com/owners`);
            return dispatch({
                type: GET_OWNERS,
                payload: response.data
            })
        } catch (err) {
            console.log(err);
        }
    }
};

export function getOwnerByName(name) {
    return async function (dispatch) {
        try {
            let response = await axios.get(`https://proyecto-grupal.herokuapp.com/owners?name=${name}`);
            return dispatch({
                type: GET_OWNER_BY_NAME,
                payload: response.data
            })
        } catch (err) {
            console.log(err);
        }
    }
};

export function putOwner(email, modification) {
    return async function () {
        try {
            await axios.put(`https://proyecto-grupal.herokuapp.com/owners/${email}`, modification);
        } catch (err) {
            console.log(err);
        }
    }
};

export function getOwnerById(email) {
    return async function (dispatch) {
        try {
            let response = await axios.get(`https://proyecto-grupal.herokuapp.com/owners/${email}`);
            return dispatch({
                type: GET_OWNER_BY_ID,
                payload: response.data
            })
        } catch (err) {
            console.log(err);
        }
    }
};

export function getProviders() {
    return async function (dispatch) {
        try {
            let response = await axios.get(`https://proyecto-grupal.herokuapp.com/providers`);
            return dispatch({
                type: GET_PROVIDERS,
                payload: response.data
            })
        } catch (err) {
            console.log(err);
        }
    }
};

export function getProviderById(email) {
    return async function (dispatch) {
        try {
            let response = axios.get(`https://proyecto-grupal.herokuapp.com/providers/${email}`);
            return dispatch({
                type: GET_PROVIDER_BY_ID,
                payload: response.data
            })
        } catch (err) {
            console.log(err);
        }
    }
};

export function getSales() {
    return async function (dispatch) {
        try {
            let response = await axios.get(`https://proyecto-grupal.herokuapp.com/solds`);
            return dispatch({
                type: GET_SALES,
                payload: response.data
            })
        } catch (err) {
            console.log(err);
        }
    }
};

export function filterByOwner(payload) {
    return {
        type: FILTER_BY_OWNER,
        payload
    }
};

export function putProvider(modification) {
    return async function () {
        try {
            await axios.put(`https://proyecto-grupal.herokuapp.com/providers/`, modification);
        } catch (err) {
            console.log(err);
        }
    }
};

export function postPet(newPet) {
    return async function () {
        try {
            await axios.post(`https://proyecto-grupal.herokuapp.com/pets`, newPet);
        } catch (err) {
            console.log(err);
        }
    }
};

export function getPets() {
    return async function (dispatch) {
        try {
            let response = await axios.get(`https://proyecto-grupal.herokuapp.com/pets`);
            return dispatch({
                type: GET_PETS,
                payload: response.data
            })
        } catch (err) {
            console.log(err);
        }
    }
};

export function postProvider(newProvider) {
    return async function () {
        try {
            await axios.post(`https://proyecto-grupal.herokuapp.com/providers`, newProvider);
        } catch (err) {
            console.log(err)
        }
    }
};

export function sortByProviderPrice(payload) {
    return {
        type: SORT_PROVIDER_PRICE,
        payload
    }
};

export function filterByProviderService(payload) {
    return {
        type: FILTER_PROVIDER_PRICE,
        payload
    }
};

export function getEvents() {
    return async function (dispatch) {
        try {
            let response = await axios.get(`https://proyecto-grupal.herokuapp.com/events`);
            return dispatch({
                type: GET_EVENTS,
                payload: response.data
            })
        } catch (err) {
            console.log(err);
        }
    }
};

export function postEvent(newEvent) {
    return async function () {
        try {
            await axios.post(`https://proyecto-grupal.herokuapp.com/events`, newEvent);
        } catch (err) {
            console.log(err);
        }
    }
};

export function getReviews() {
    return async function (dispatch) {
        try {
            let response = await axios.get(`https://proyecto-grupal.herokuapp.com/reviews`);
            return dispatch({
                type: GET_REVIEWS,
                payload: response.data
            })
        } catch (err) {
            console.log(err);
        }
    }
};

export function putEvent(id, modification) {
    return async function () {
        try {
            await axios.put(`https://proyecto-grupal.herokuapp.com/events/${id}`, modification);
        } catch (err) {
            console.log(err);
        }
    }
};

export function selectedEvent(payload) {
    return {
        type: SELECTED_EVENT,
        payload
    }
};

export function groupEvents() {
    return {
        type: GROUP_EVENTS
    }
};