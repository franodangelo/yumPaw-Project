import React from "react";
import ReactLoading from "react-loading";
import styles from "./loading.module.css";

export default function Loader() {
    return (
        <div>
            <div className={styles.loaderContainer}>
                <ReactLoading type="spinningBubbles" color="#7e52a0"
                    height={300} width={150} />
            </div>
        </div>
    );
}