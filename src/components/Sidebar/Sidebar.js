import React from "react";
import GetFileBtn from "./GetFileBtn";
import TreeItem from "./Tree/TreeItem";
import TreeList from "./Tree/TreeList";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <GetFileBtn />
      <TreeList>
        <TreeItem />
      </TreeList>
    </div>
  );
}
