import { React, useState } from "react";
import styles from "../../../styles/tree.module.css";
import TreeList from "./TreeList";

const { ipcRenderer } = window.require("electron");

export default function TreeFolder(props) {
  const [folderToggle, setFolderToggle] = useState(false);
  const [isActive, setIsActive] = useState(false);

  ipcRenderer.on("active", (event, data) => {
    props.path === data ? setIsActive(true) : setIsActive(false);
  });

  return (
    <div>
      <button
        className={`${styles.treeFolder} ${isActive ? styles.active : ""}`}
        onClick={() => {
          ipcRenderer.send("active-item", props.path);
          if (props.contents.length === 0) {
            setFolderToggle(false);
          } else {
            if (folderToggle === true) {
              setFolderToggle(false);
            } else {
              setFolderToggle(true);
            }
          }
        }}
      >
        Folder: {props.name}
      </button>
      {folderToggle === true ? (
        // fix isFolder prop
        <TreeList tree={props.contents} isFolder={folderToggle} />
      ) : null}
    </div>
  );
}
