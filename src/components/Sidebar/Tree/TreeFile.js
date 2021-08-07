import React from "react";
import styles from "../../../styles/treeItem.module.css";

const { ipcRenderer } = window.require("electron");

export default function TreeFile(props) {
  return (
    <div>
      <button
        className={styles.treeFile}
        onClick={() => {
          ipcRenderer.send("get-file", props.path);
        }}
      >
        File: {props.name}
      </button>
    </div>
  );
}
