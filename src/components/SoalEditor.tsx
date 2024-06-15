import { useRef } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import type { Dispatch, RefObject, SetStateAction } from "react";
import type Quill from "quill";

import { RichTextEditor } from "./RichTextEditor";
import { deltaToHTMLString } from "../utils/quill";

interface SoalEditorProps {
  soalIDRef: RefObject<HTMLInputElement>;
  quillInstance: Quill;
  setQuillInstance: Dispatch<SetStateAction<Quill>>;
}

export function SoalEditor({
  soalIDRef,
  quillInstance,
  setQuillInstance,
}: SoalEditorProps): JSX.Element {
  const soalIDDescRef = useRef<HTMLElement>(null);
  const registeredIDText = "ID soal sudah terdaftar!";
  const unregisteredIDText = "Setiap ID pada soal harus unik.";

  function checkIDSoal() {
    setTimeout(() => {
      const smallEl = soalIDDescRef.current as HTMLElement;
      smallEl.classList.replace("text-muted", "text-red-600");
      smallEl.classList.add("italic");
      smallEl.textContent = registeredIDText;
    }, 1000);
  }

  function showEditorPreview(eventKey: string | null) {
    const divEl = document.getElementById("soal-preview") as HTMLDivElement;
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
      id="soal-form"
      defaultActiveKey="editor"
      variant="underline"
      className="mb-4"
    >
      <Tab eventKey="editor" title="Editor">
        <Form.Group controlId="soal_id" className="max-w-sm mb-6">
          <div className="flex justify-start items-center gap-x-6">
            <Form.Control
              ref={soalIDRef}
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

          <Form.Text
            ref={soalIDDescRef}
            className="text-muted transition-all duration-300"
          >
            {unregisteredIDText}
          </Form.Text>
        </Form.Group>

        <Form.Group>
          <Form.Label as="p">Teks Editor Soal</Form.Label>
          <RichTextEditor
            setQuillInstance={setQuillInstance}
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
