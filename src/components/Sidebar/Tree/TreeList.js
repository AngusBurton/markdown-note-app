import { React, useState } from "react";
import TreeFile from "./TreeFile";
import TreeFolder from "./TreeFolder";

const { ipcRenderer } = window.require("electron");

export default function TreeList() {
  const [treeList, setTreeList] = useState([]);

  ipcRenderer.on("tree", (event, data) => {
    // receive folder contents
    let tree = data.children;

    setTreeList(tree);
  });

  return (
    <div>
      {treeList.map((item, index) =>
        item.type === "file" ? (
          <TreeFile key={index} name={item.name} />
        ) : (
          <TreeFolder key={index} name={item.name} />
        )
      )}
    </div>
  );
}
