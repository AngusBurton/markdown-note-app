import React, { useState } from "react";
import Editor from "./components/Editor";
import MarkdownParser from "./components/MarkdownParser";
import Sidebar from "./components/Sidebar/Sidebar";

const { ipcRenderer } = window.require("electron");

function App() {
  const [text, setText] = useState("");
  const [markdown, setMarkdown] = useState("");

  ipcRenderer.on("reply", (event, data) => {
    setText(data);
    setMarkdown(data);
  });
  return (
    <div className="App">
      <Sidebar />
      <Editor
        language="markdown"
        value={text}
        onChange={setText}
        setMarkdown={setMarkdown}
      />
      <MarkdownParser markdown={markdown} />
    </div>
  );
}

export default App;
