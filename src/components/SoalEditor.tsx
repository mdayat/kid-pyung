import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import type { Dispatch, SetStateAction } from "react";
import type Quill from "quill";

import { RichTextEditor } from "./RichTextEditor";
import { deltaToHTMLString } from "../utils/quill";

interface SoalEditorProps {
  soalQuill: Quill;
  setSoalQuill: Dispatch<SetStateAction<Quill>>;
}

export function SoalEditor({
  soalQuill,
  setSoalQuill,
}: SoalEditorProps): JSX.Element {
  function checkIDSoal() {}

  function viewSoalPreview(eventKey: string | null) {
    const divEl = document.getElementById("soal-preview") as HTMLDivElement;
    if (eventKey === "preview") {
      const htmlString = deltaToHTMLString(soalQuill.getContents());
      divEl.insertAdjacentHTML("beforeend", htmlString);
    } else {
      divEl.innerHTML = "";
    }
  }

  return (
    <Tabs
      onSelect={viewSoalPreview}
      justify
      id="soal-form"
      defaultActiveKey="editor"
      variant="underline"
      className="mb-4"
    >
      <Tab eventKey="editor" title="Editor">
        <Form.Group controlId="soal_id" className="max-w-sm mb-6">
          <div className="flex justify-start items-center gap-x-6">
            <Form.Control
              required
              type="text"
              placeholder="Masukkan ID Soal..."
              autoComplete="off"
              className="placeholder:text-sm"
            />

            <Button
              onClick={checkIDSoal}
              type="button"
              variant="primary"
              size="sm"
              className="shrink-0"
            >
              Cek ID Soal
            </Button>
          </div>

          <Form.Text className="text-muted">
            Setiap ID pada soal harus unik.
          </Form.Text>
        </Form.Group>

        <Form.Group>
          <Form.Label as="p">Teks Editor Soal</Form.Label>
          <RichTextEditor
            setEditorInstance={setSoalQuill}
            editorID="soal-editor"
            toolbarID="soal-toolbar"
          />
        </Form.Group>
      </Tab>

      <Tab eventKey="preview" title="Preview">
        <div id="soal-preview" className="border !p-4 [&_img]:w-96"></div>
      </Tab>
    </Tabs>
  );
}
