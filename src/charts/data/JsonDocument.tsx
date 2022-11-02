import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";

export default function JsonDocument({jsonObject} : {jsonObject : object[]}) {

  return (
    <SyntaxHighlighter language="json" showLineNumbers={true}>
      {JSON.stringify(jsonObject, null, "  ")}
    </SyntaxHighlighter>
  );

}
