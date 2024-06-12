import Form from "react-bootstrap/Form";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import type { Dispatch, SetStateAction } from "react";
import type Quill from "quill";

import { RichTextEditor } from "./RichTextEditor";
import { deltaToHTMLString } from "../utils/quill";

interface PembahasanEditorProps {
  quillInstance: Quill;
  setQuillInstance: Dispatch<SetStateAction<Quill>>;
}

export function PembahasanEditor({
  quillInstance,
  setQuillInstance,
}: PembahasanEditorProps): JSX.Element {
  function showEditorPreview(eventKey: string | null) {
    const divEl = document.getElementById(
      "pembahasan-preview"
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
      id="pembahasan-form"
      defaultActiveKey="editor"
      variant="underline"
      className="mb-4"
    >
      <Tab eventKey="editor" title="Editor">
        <Form.Group>
          <Form.Label as="p">Teks Editor Pembahasan</Form.Label>
          <RichTextEditor
            setQuillInstance={setQuillInstance}
            editorID="pembahasan-editor"
            toolbarID="pembahasan-toolbar"
          />
        </Form.Group>
      </Tab>

      <Tab eventKey="preview" title="Preview">
        <div id="pembahasan-preview" className="border !p-4 [&_img]:w-96"></div>
      </Tab>
    </Tabs>
  );
}
