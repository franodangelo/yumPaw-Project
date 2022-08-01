import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { removeFromCart } from "../../redux/actions/petshopActions";
import { ADD_ITEM, DELETE_ITEM } from "../../redux/actions-type/petshopActionsTypes";
import styles from "../ShoppingCart/CartItem.module.css";

export default function CartItem({ name, image, price, quantity, id, stock }) {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const cartItem = cart.find(ci => ci.id === id);

  const deleteFromCart = (id) => {
    dispatch(removeFromCart(id, 'cart'));
  };

  const addItem = () => {
    if (cartItem.stock > cartItem.quantity) {
      dispatch({
        type: ADD_ITEM,
        payload: id,
        email: 'cart',
        stock: stock
      });
    }
    else Swal.fire('Límite de stock alcanzado.', '', 'warning');
  };

  const deleteItem = () => {
    dispatch({
      type: DELETE_ITEM,
      payload: id,
      email: 'cart'
    });
  };


  return (
    <div className={styles.container}>
      <div className={styles.productGrid}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tr}>
              <th className={styles.th}>
                <Link to={`/shop/${id}`}>
                  <img src={image} alt="producto-petshop" width="100" height="100" />
                </Link>
              </th>
              <th className={styles.th}>
                <div className={styles.item}>
                  <h4 className={styles.productName}>{name}</h4>
                  <button
                    onClick={() => deleteFromCart(id)}
                    className={styles.buttonDelete}
                  >Eliminar
                  </button>
                </div>
              </th>
              <th className={styles.th}>
                <h5 className={styles.price}>${price}.00</h5>
              </th>
              <th className={styles.th}>
                <div className={styles.centerButton}>
                  <div className={styles.addOneItem}>
                    <span className={styles.button} onClick={deleteItem}>
                      -
                    </span>
                    <div className={styles.count}>{quantity}</div>
                    <span className={styles.button} onClick={addItem}>
                      +
                    </span>
                  </div>
                </div>
              </th>
              <th className={styles.th}>
                <h5 className={styles.total}>${price * quantity}.00</h5>
              </th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
};