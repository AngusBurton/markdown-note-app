import React from "react";
import styles from "../../../styles/treeItem.module.css";

export default function TreeFolder(props) {
  return (
    <div>
      <button className={styles.treeFolder}>Folder: {props.name}</button>
    </div>
  );
}
