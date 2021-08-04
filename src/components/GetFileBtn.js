import React from "react";
// const electron = window.require("electron");
// const { shell } = window.require("electron");
// const remote = electron.remote;
// const { dialog } = remote;

const { ipcRenderer } = window.require("electron");

ipcRenderer.on("reply", (event, data) => {
  console.log(data);
});

const GetFileBtn = () => {
  return (
    <button
      onClick={() => {
        ipcRenderer.send("file", "poopies");
      }}
    >
      Open Dialog to Select a file
    </button>
  );
};

export default GetFileBtn;
