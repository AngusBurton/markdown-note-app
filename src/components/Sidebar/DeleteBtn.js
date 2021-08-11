import React from "react";
const { ipcRenderer } = window.require("electron");

export default function DeleteBtn() {
  return (
    <button
      onClick={() => {
        ipcRenderer.send("delete", "i like turtles");
      }}
    >
      [x]
    </button>
  );
}
