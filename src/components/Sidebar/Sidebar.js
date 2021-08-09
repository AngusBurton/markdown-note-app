import { React, useState } from "react";
import GetFolderBtn from "./GetFolderBtn";
import NewFileBtn from "./NewFileBtn";
import TreeList from "./Tree/TreeList";

const { ipcRenderer } = window.require("electron");

export default function Sidebar() {
  const [treeList, setTreeList] = useState([]);

  ipcRenderer.on("tree", (event, data) => {
    // receive folder contents
    let tree = data.children;
    setTreeList(tree);
  });

  return (
    <div className="sidebar">
      <GetFolderBtn />
      <NewFileBtn />
      <TreeList tree={treeList} />
    </div>
  );
}
