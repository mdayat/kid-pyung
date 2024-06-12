import { useEffect, useRef } from "react";
import Quill from "quill";
import type { Dispatch, SetStateAction } from "react";

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";

interface RichTextEditorProps {
  editorID: string;
  toolbarID: string;
  setEditorInstance: Dispatch<SetStateAction<Quill>>;
}

export function RichTextEditor({
  editorID,
  toolbarID,
  setEditorInstance,
}: RichTextEditorProps): JSX.Element {
  const runOnce = useRef(true);
  useEffect(() => {
    if (runOnce.current) {
      const quill = new Quill(`#${editorID}`, {
        modules: {
          toolbar: `#${toolbarID}`,
        },
        placeholder: "Klik untuk mengetik...",
        theme: "snow",
      });
      setEditorInstance(quill);
    }

    return () => {
      runOnce.current = false;
    };
  }, [editorID, toolbarID, setEditorInstance]);

  return (
    <>
      <div id={toolbarID}>
        <span className="ql-formats">
          <select className="ql-font"></select>
        </span>

        <span className="ql-formats">
          <button className="ql-bold"></button>
          <button className="ql-italic"></button>
          <button className="ql-underline"></button>
        </span>

        <span className="ql-formats">
          <button className="ql-image"></button>
          <button className="ql-formula"></button>
        </span>
      </div>

      <div id={editorID} className="[&_img]:w-96"></div>
    </>
  );
}
