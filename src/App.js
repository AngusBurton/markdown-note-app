import React, { useState } from "react";
import Editor from "./components/Editor";
import Sidebar from "./components/Sidebar";

function App() {
  const [text, setText] = useState("");
  return (
    <div className="App">
      <Sidebar />
      <Editor language="markdown" value={text} onChange={setText} />
    </div>
  );
}

export default App;
