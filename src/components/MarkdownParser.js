import React from "react";
import ReactMarkdown from "react-markdown";

export default function MarkdownParser(props) {
  return (
    <ReactMarkdown
      className="markdownParser"
      parserOptions={{ commonmark: true }}
    >
      {props.markdown}
    </ReactMarkdown>
  );
}
