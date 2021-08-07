import React from "react";
import GetFileBtn from "./GetFileBtn";
import TreeList from "./Tree/TreeList";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <GetFileBtn />
      <TreeList></TreeList>
    </div>
  );
}
