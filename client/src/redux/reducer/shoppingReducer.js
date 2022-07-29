import { TYPES } from '../actions/shoppingActions';
import axios from "axios";

export const shoppingInitialState = {
    cart: []
};

export function shoppingReducer(state, action) {
    switch (action.type) {
        case TYPES.ADD_TO_CART: {
            // Buscamos id en el arreglo de productos y guardamos el producto que coincida con el id
            axios.get('https://proyecto-grupal.herokuapp.com/products').then(x => {
                const product = x.find(product => product.id === action.payload);
            })
        }
        case TYPES.REMOVE_ONE_FROM_CART: {
            let itemToDelete = state.cart.find(item => item.id === action.payload);
            return itemToDelete.quantity > 1 ? {
                ...state,
                cart: state.cart.map(item =>
                    item.id === action.payload ? {
                        ...item,
                        quantity: item.quantity - 1
                    } :
                    item
                )
            } : {
                ...state,
                cart: state.cart.filter(item => item.id !== action.payload)
            }
        }
        case TYPES.REMOVE_ALL_FROM_CART: {
            return {
                ...state,
                cart: state.cart.filter(item => item.id !== action.payload)
            }
        }
        case TYPES.CLEAR_CART: {
            return shoppingInitialState;
        }
        default:
            return state;
    }
};