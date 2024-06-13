import Form from "react-bootstrap/Form";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import type Quill from "quill";
import type { Dispatch, SetStateAction } from "react";

import { RichTextEditor } from "./RichTextEditor";
import { deltaToHTMLString } from "../utils/quill";

interface JawabanEditorProps {
  jawaban: {
    quillInstance: Quill;
    setQuillInstance: Dispatch<SetStateAction<Quill>>;
  }[];
}

export function JawabanEditor({ jawaban }: JawabanEditorProps): JSX.Element {
  function showEditorPreview(eventKey: string | null) {
    if (eventKey === "preview") {
      for (let i = 0; i < jawaban.length; i++) {
        const divEl = document.getElementById(
          `jawaban${i + 1}-preview`
        ) as HTMLDivElement;

        const htmlString = deltaToHTMLString(
          jawaban[i].quillInstance.getContents()
        );

        divEl.insertAdjacentHTML("beforeend", htmlString);
      }
    } else {
      for (let i = 0; i < jawaban.length; i++) {
        const divEl = document.getElementById(
          `jawaban${i + 1}-preview`
        ) as HTMLDivElement;
        divEl.innerHTML = "";
      }
    }
  }

  return (
    <Tabs
      onSelect={showEditorPreview}
      justify
      id="jawaban-form"
      defaultActiveKey="editor"
      variant="underline"
      className="mb-4"
    >
      <Tab eventKey="editor" title="Editor">
        {jawaban.map(({ setQuillInstance }, index) => (
          <Form.Group
            key={`jawaban${index + 1}-rich-text-editor`}
            className="mb-6 last:mb-0"
          >
            <Form.Label as="p">Teks Editor Jawaban {index + 1}</Form.Label>
            <RichTextEditor
              setQuillInstance={setQuillInstance}
              editorID={`jawaban${index + 1}-editor`}
              toolbarID={`jawaban${index + 1}-toolbar`}
            />
          </Form.Group>
        ))}
      </Tab>

      <Tab eventKey="preview" title="Preview">
        {jawaban.map((_, index) => (
          <div
            key={`jawaban${index + 1}-preview`}
            id={`jawaban${index + 1}-preview`}
            className="border !p-4 [&_img]:w-96 !mb-4 last:!mb-0"
          ></div>
        ))}
      </Tab>
    </Tabs>
  );
}
