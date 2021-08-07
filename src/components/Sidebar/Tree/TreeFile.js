import React from "react";
import styles from "../../../styles/treeItem.module.css";

export default function TreeFile(props) {
  return (
    <div>
      <button className={styles.treeFile}>File: {props.name}</button>
    </div>
  );
}
