import { React, useState } from "react";
import DeleteBtn from "./DeleteBtn";
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
      <DeleteBtn />
      <TreeList tree={treeList} />
      <div className={"free-tree-space"}></div>
    </div>
  );
}
