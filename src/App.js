import React, { useState } from "react";
import Editor from "./components/Editor";
import Sidebar from "./components/Sidebar/Sidebar";

const { ipcRenderer } = window.require("electron");

function App() {
  const [text, setText] = useState("");

  ipcRenderer.on("reply", (event, data) => {
    setText(data);
  });
  return (
    <div className="App">
      <Sidebar />
      <Editor language="markdown" value={text} onChange={setText} />
    </div>
  );
}

export default App;
