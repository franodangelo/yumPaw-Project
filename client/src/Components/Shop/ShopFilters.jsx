import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  getProducts,
  sortByPrice,
  filterByCategory,
  filterTargetAnimal,
  searchBarProducts
} from "../../redux/actions/petshopActions";
import styles from "./ShopFilters.module.css";

export default function ShopFilters() {
  let dispatch = useDispatch();
  const [inputSearchBar, setInputSearchBar] = useState('');
  let [select, setSelect] = useState([]);
  let [petValue, setPetValue] = useState('pets');
  let [priceValue, setPriceValue] = useState('price');
  let [checkedOne, setCheckedOne] = useState(false);
  let [checkedTwo, setCheckedTwo] = useState(false);
  let [checkedThree, setCheckedThree] = useState(false);

  useEffect(() => {
    dispatch(getProducts());
  }, []);

  // Hook search bar
  useEffect(() => {
    dispatch(searchBarProducts(inputSearchBar))
  }, [dispatch, inputSearchBar]);

  // Handler search bar
  function onInputChangeSearchbar(e) {
    e.preventDefault();
    setInputSearchBar(e.target.value);
  };

  function handleFilterTargetAnimal(e) {
    dispatch(filterTargetAnimal(e.target.value));
    setPetValue(e.target.value);
  };

  function handleOrder(e) {
    dispatch(sortByPrice(e.target.value));
    setPriceValue(e.target.value);
  };

  function handleRemove(e) {
    e.preventDefault();
    dispatch(getProducts());
    setInputSearchBar('');
    setPetValue('pets');
    setPriceValue('price');
    setSelect([]);
    setCheckedOne(false);
    setCheckedTwo(false);
    setCheckedThree(false);
  };

  function checkCategoryOne(e) {
    let selection = e.target.value;
    let already = select.includes(selection);

    if (!already) {
      setSelect(select = [...select, e.target.value]);
    }
    if (already) {
      let aux = select.filter((el) => el !== selection);
      setSelect(select = aux);
    }
    dispatch(filterByCategory(select));
    setCheckedOne(!already);
  };

  function checkCategoryTwo(e) {
    let selection = e.target.value;
    let already = select.includes(selection);
    if (!already) {
      setSelect(select = [...select, e.target.value]);
    }
    if (already) {
      let aux = select.filter((el) => el !== selection);
      setSelect(select = aux);
    }
    dispatch(filterByCategory(select));
    setCheckedTwo(!already);
  };

  function checkCategoryThree(e) {
    let selection = e.target.value;
    let already = select.includes(selection);
    if (!already) {
      setSelect(select = [...select, e.target.value]);
    }
    if (already) {
      let aux = select.filter((el) => el !== selection);
      setSelect(select = aux);
    }
    dispatch(filterByCategory(select));
    setCheckedThree(!already);
  };

  return (
    <div className={styles.container}>
      <div className={styles.container}>
        <section className={styles.selects} >
          <p className={styles.filterTitle}>Buscar producto</p>
          <input
            type="text"
            value={inputSearchBar}
            placeholder="Ingresá tu búsqueda..."
            className={styles.search}
            onChange={onInputChangeSearchbar}
          />
        </section>
      </div>
      <section className={styles.selects}>
        <p className={styles.filterTitle}>Filtrar por Mascota</p>
        <select className={styles.select} value={petValue} onChange={handleFilterTargetAnimal}>
          <option value="todos" disabled selected>Tipo de Mascota</option>
          <option value="perro">Perro</option>
          <option value="gato">Gato</option>
          <option value="tortuga">Tortuga</option>
          <option value="conejo">Conejo</option>
          <option value="pez">Peces</option>
          <option value="pajaro">Aves</option>
        </select>
      </section>
      <section className={styles.selects}>
        <div className={styles.checkbox}>
          <input
            type="checkbox"
            value="alimento"
            onClick={checkCategoryOne}
            className={styles.inputCheck}
            checked={checkedOne}
          />
          <span className={styles.checkTitle}>Alimento</span>
        </div>
        <div className={styles.checkbox}>
          <input
            type="checkbox"
            value="accesorios"
            onClick={checkCategoryTwo}
            className={styles.inputCheck}
            checked={checkedTwo}
          />
          <span className={styles.checkTitle}>Accesorios</span>
        </div>
        <div className={styles.checkbox}>
          <input
            type="checkbox"
            value="salud y bienestar"
            onClick={checkCategoryThree}
            className={styles.inputCheck}
            checked={checkedThree}
          />
          <span className={styles.checkTitle}>Salud y bienestar</span>
        </div>
      </section>
      <section className={styles.selects} onChange={(e) => handleOrder(e)}>
        <p className={styles.filterTitle}>Ordenar por</p>
        <select className={styles.select} value={priceValue}>
          <option value='price' disabled selected>Precio</option>
          <option value="ASC">Menor a mayor</option>
          <option value="DESC">Mayor a menor</option>
        </select>
      </section>
      <button className="secondaryButton" onClick={handleRemove}>Limpiar filtros</button>
    </div>
  );
};