import React from "react";
import ReactMarkdown from "react-markdown";
import styles from "../styles/markdown.module.css";

export default function MarkdownParser(props) {
  return (
    <ReactMarkdown
      className={styles.markdownParser}
      parserOptions={{ commonmark: true }}
    >
      {props.markdown}
    </ReactMarkdown>
  );
}
