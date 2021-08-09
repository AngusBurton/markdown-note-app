import { React, useState } from "react";
import styles from "../../../styles/tree.module.css";

const { ipcRenderer } = window.require("electron");

export default function TreeFile(props) {
  const [isActive, setIsActive] = useState(false);

  ipcRenderer.on("active", (event, data) => {
    props.path === data ? setIsActive(true) : setIsActive(false);
  });

  return (
    <div>
      <button
        className={`${styles.treeFile} ${isActive ? styles.active : ""}`}
        onClick={() => {
          ipcRenderer.send("get-file", props.path);
          ipcRenderer.send("active-item", props.path);
        }}
      >
        File: {props.name}
      </button>
      <button
        onClick={() => {
          ipcRenderer.send("delete", props.path);
        }}
      >
        DELETE
      </button>
    </div>
  );
}
