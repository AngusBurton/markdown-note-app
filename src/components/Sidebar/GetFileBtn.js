import React from "react";
// const electron = window.require("electron");
// const { shell } = window.require("electron");
// const remote = electron.remote;
// const { dialog } = remote;

const { ipcRenderer } = window.require("electron");

const GetFileBtn = () => {
  return (
    <button
      onClick={() => {
        ipcRenderer.send("get-folder", "poopies");
      }}
    >
      Open Dialog to Select a file
    </button>
  );
};

export default GetFileBtn;
