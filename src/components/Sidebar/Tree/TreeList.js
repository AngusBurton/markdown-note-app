import { React } from "react";
import TreeFile from "./TreeFile";
import TreeFolder from "./TreeFolder";
import styles from "../../../styles/tree.module.css";

export default function TreeList(props) {
  return (
    <div className={styles.treeList}>
      {props.tree.map((item, index) =>
        item.type === "file" ? (
          <TreeFile key={index} name={item.name} path={item.path} />
        ) : (
          <TreeFolder
            key={index}
            name={item.name}
            contents={item.children}
            path={item.path}
          />
        )
      )}
    </div>
  );
}
