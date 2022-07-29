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

import {
    GET_PRODUCTS,
    SEARCHBAR_PRODUCTS,
    SORT_PRICE,
    FILTER_CATEGORY,
    FILTER_TARGET_ANIMAL,
    ID_PRODUCT,
    CHARGE_CART,
    REMOVE_FROM_CART,
    CLEAR_CART,
    ADD_ITEM,
    DELETE_ITEM,
    CHARGE_FAVORITES,
    SELECTED_PRODUCT,
    CLEAN_DETAIL
} from '../actions-type/petshopActionsTypes';

import { TYPES } from '../actions/shoppingActions';

const initialState = {
    owners: [],
    copyOwners: [],
    providers: [],
    copyProviders: [],
    products: [],
    filteredProducts: [],
    cart: [],
    productDetail: [],
    pets: [],
    favorites: [],
    filteredProviders: [],
    events: [],
    selectedProduct: null,
    selectedEvent: null,
    sells: [],
    reviews: [],
    groupEvents: []
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case TYPES.ADD_TO_CART:
            let product = state.products.find(product => product.id === action.payload);
            if (state.cart.find(c => c.id === action.payload)) {
                product = state.cart.find(c => c.id === action.payload);
                product.quantity = product.quantity + action.quantity;
                var cart = state.cart.filter(c => c.id !== action.payload);
                cart = [...cart, product];
                localStorage.setItem(action.email, JSON.stringify(cart));
                return {
                    ...state,
                    cart: cart
                }
            } else {
                product.quantity = action.quantity;
                cart = [...state.cart, product];
                localStorage.setItem(action.email, JSON.stringify(cart));
                return {
                    ...state,
                    cart: [...state.cart, product]
                }
            }
        case REMOVE_FROM_CART:
            const cartWithoutItem = state.cart.filter(c => c.id !== action.payload)
            localStorage.removeItem(action.email)
            localStorage.setItem(action.email, JSON.stringify(cartWithoutItem))
            return {
                ...state,
                cart: cartWithoutItem
            }
        case CHARGE_FAVORITES:
            return {
                ...state,
                favorites: action.payload
            }
        case CHARGE_CART:
            if (localStorage.getItem(action.email)) {
                let dataUser = JSON.parse(localStorage.getItem(action.email));
                return {
                    ...state,
                    cart: dataUser
                }
            }
        case CLEAR_CART:
            localStorage.removeItem(action.email);
            return {
                ...state,
                cart: []
            }
        case GET_OWNERS:
            return {
                ...state,
                owners: action.payload,
                copyOwners: action.payload
            }
        case GET_PROVIDERS:
            return {
                ...state,
                providers: action.payload,
                filteredProviders: action.payload
            }
        case GET_OWNER_BY_NAME:
            return {
                ...state,
                copyOwners: action.payload
            }
        case GET_SALES:
            return {
                ...state,
                sells: action.payload
            }    
        case FILTER_BY_OWNER:
            return {
                ...state,
                copyOwners: state.owners.filter(o => action.payload)
            }
        case GET_PRODUCTS:
            return {
                ...state,
                products: action.payload,
                filteredProducts: action.payload
            }
        case SEARCHBAR_PRODUCTS:
            return {
                ...state,
                filteredProducts: action.payload
            }
        case FILTER_CATEGORY:
            var filteredByCategory = [];
            state.products.map(
                prod => {
                    action.payload.map(
                        target => {
                            prod.category === target && filteredByCategory.push(prod);
                        }
                    )
                }
            )
            if(!filteredByCategory.length) filteredByCategory = state.products;
            return {
                ...state,
                filteredProducts: filteredByCategory
            }
        case SORT_PRICE:
            let sortProduct = [...state.filteredProducts];
            if (action.payload === 'ASC') {
                sortProduct.sort((a, b) => {
                    if (a.price > b.price) return 1
                    if (a.price < b.price) return -1
                    return 0
                })
            }
            if (action.payload === 'DESC') {
                sortProduct.sort((a, b) => {
                    if (a.price > b.price) return -1
                    if (a.price < b.price) return 1
                    return 0
                })
            }
            return {
                ...state,
                filteredProducts: sortProduct
            }
        case FILTER_TARGET_ANIMAL:
            return {
                ...state,
                filteredProducts: action.payload !== 'all' 
                ? state.products.filter(p => action.payload === p.targetAnimal)
                : state.products
            }
        case ID_PRODUCT:
            return{
                ...state,
                productDetail: [action.payload]
            }
        case GET_PROVIDER_BY_ID:
            return{
                ...state,
                providers: [action.payload]
            }
        case GET_OWNER_BY_ID:
            return{
                ...state,
                owners: [action.payload]
            }
        case GET_PETS:
            return{
                ...state,
                pets: action.payload
            }
        case ADD_ITEM:
            let cartWithItem = state.cart.map(i => {
                if (i.id === action.payload && i.quantity < action.stock) {
                    return ({
                        ...i,
                        quantity: i.quantity + 1
                    })
                } else return i;
            });
            localStorage.setItem(action.email, JSON.stringify(cartWithItem));
            return {
                ...state,
                cart: cartWithItem
            }
        case DELETE_ITEM:
            let newCart = state.cart.map(i => {
                if (i.id === action.payload && i.quantity > 1) {
                    return ({
                        ...i,
                        quantity: i.quantity - 1
                    })
                } else return i;
            })
            localStorage.setItem(action.email, JSON.stringify(newCart));
            return {
                ...state,
                cart: newCart
            }
        case FILTER_PROVIDER_PRICE:
            return {
                ...state,
                filteredProviders: action.payload !== 'all' 
                ? state.providers.filter(p => action.payload === p.service[0])
                : state.providers
            }
        case SORT_PROVIDER_PRICE:
            let sortService = [...state.filteredProviders];
            if (action.payload === 'ASC') {
                sortService.sort((a, b) => { 
                    if (a.price > b.price) return 1;
                    if (a.price < b.price) return -1;
                    return 0;
                });
            }
            if (action.payload === 'DESC') {
                sortService.sort((a, b) => {
                    if (a.price > b.price) return -1;
                    if (a.price < b.price) return 1;
                    return 0;
                });
            }
            return {
                ...state,
                filteredProviders: sortService
            }
        case GET_EVENTS:
            return {
                ...state,
                events: action.payload
            }
        case SELECTED_PRODUCT:
            return {
                ...state,
                selectedProduct: action.payload
            }
        case SELECTED_EVENT:
            return {
                ...state,
                selectedEvent: action.payload
            }
        case GET_REVIEWS:
            return {
                ...state,
                reviews: action.payload
            }
        case CLEAN_DETAIL:
            return {
                ...state,
                productDetail: action.payload,
                providers: action.payload, 
                copyProviders: action.payload,
                owners: action.payload,
                events: action.payload
            }
        case GROUP_EVENTS:
            let eventGroup = [];
            while(state.groupEvents.length > 0) {
            let newArray = state.groupEvents.filter(g => {
                if(g.numberOfBooking === state.groupEvents[0].numberOfBooking){     
            return g 
                }
            });
            eventGroup.push(newArray);
            let newEvents = state.groupEvents.filter(e => e.numberOfBooking !== state.groupEvents[0].numberOfBooking)        
            state.groupEvents = newEvents
                }
            return{
                ...state,
                groupEvents: eventGroup
            }
        default:
            return state;
    }
};

export default rootReducer;