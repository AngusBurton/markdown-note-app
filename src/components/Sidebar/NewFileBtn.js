import { React, useState } from "react";

const { ipcRenderer } = window.require("electron");

const NewFileBtn = () => {
  const [inputName, setInputName] = useState("");

  return (
    <div>
      <input
        type="text"
        value={inputName}
        onChange={(e) => {
          setInputName(e.target.value);
        }}
      />
      <button
        onClick={() => {
          ipcRenderer.send("new-file", inputName);
          setInputName("");
        }}
      >
        NEW FILE
      </button>
      <button
        onClick={() => {
          ipcRenderer.send("new-folder", inputName);
          setInputName("");
        }}
      >
        NEW FOLDER
      </button>
    </div>
  );
};

export default NewFileBtn;
