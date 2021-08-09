import React from "react";
const { ipcRenderer } = window.require("electron");

export default function DeleteBtn(props) {
  return (
    <button
      onClick={() => {
        ipcRenderer.send("delete", props.path);
      }}
    >
      [x]
    </button>
  );
}
