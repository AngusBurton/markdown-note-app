import { React } from "react";

const { ipcRenderer } = window.require("electron");

const GetFolderBtn = () => {
  return (
    <div>
      <button
        onClick={() => {
          ipcRenderer.send("get-folder", "not needed");
        }}
      >
        OPEN FOLDER
      </button>
    </div>
  );
};

export default GetFolderBtn;
