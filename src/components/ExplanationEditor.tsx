import Form from "react-bootstrap/Form";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import type { Dispatch, SetStateAction } from "react";
import type Quill from "quill";

import { RichTextEditor } from "./RichTextEditor";
import { deltaToHTMLString } from "../utils/quill";

interface ExplanationEditorProps {
  quillInstance: Quill;
  setQuillInstance: Dispatch<SetStateAction<Quill>>;
}

export function ExplanationEditor({
  quillInstance,
  setQuillInstance,
}: ExplanationEditorProps): JSX.Element {
  function showEditorPreview(eventKey: string | null) {
    const divEl = document.getElementById(
      "explanation-preview"
    ) as HTMLDivElement;

    if (eventKey === "preview") {
      const htmlString = deltaToHTMLString(quillInstance.getContents());
      divEl.insertAdjacentHTML("beforeend", htmlString);
    } else {
      divEl.innerHTML = "";
    }
  }

  return (
    <Tabs
      onSelect={showEditorPreview}
      justify
      id="explanation-form"
      defaultActiveKey="editor"
      variant="underline"
      className="mb-4"
    >
      <Tab eventKey="editor" title="Editor">
        <Form.Group>
          <Form.Label as="p">Teks Editor Pembahasan</Form.Label>
          <RichTextEditor
            setQuillInstance={setQuillInstance}
            editorID="explanation-editor"
            toolbarID="explanation-toolbar"
          />
        </Form.Group>
      </Tab>

      <Tab eventKey="preview" title="Preview">
        <div
          id="explanation-preview"
          className="border !p-4 [&_img]:w-96"
        ></div>
      </Tab>
    </Tabs>
  );
}
