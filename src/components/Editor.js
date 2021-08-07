import { React, useState, useEffect } from "react";
import { Controlled as ControlledEditor } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/markdown/markdown";

const { ipcRenderer } = window.require("electron");

export default function Editor(props) {
  const { language, value, onChange } = props;

  const [saveFile, setFileSave] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      ipcRenderer.send("save", saveFile);
    }, 2500);

    return () => clearTimeout(delayDebounce);
  }, [saveFile]);

  function handleChange(editor, data, value) {
    onChange(value);
    setFileSave(value);
  }
  return (
    <div className="editor-container">
      <ControlledEditor
        onBeforeChange={handleChange}
        value={value}
        className="code-mirror-wrapper"
        options={{
          lineWrapping: true,
          lint: true,
          mode: language,
          lineNumbers: false,
          theme: "material",
        }}
      />
    </div>
  );
}
