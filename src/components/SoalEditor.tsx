import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import type { Dispatch, SetStateAction } from "react";
import type Quill from "quill";

import { RichTextEditor } from "./RichTextEditor";

interface SoalEditorProps {
  setSoalQuill: Dispatch<SetStateAction<Quill>>;
}

export function SoalEditor({ setSoalQuill }: SoalEditorProps): JSX.Element {
  function checkIDSoal() {}

  return (
    <Tabs justify id="soal-form" defaultActiveKey="editor" className="mb-4">
      <Tab eventKey="editor" title="Editor">
        <Form.Group controlId="soal_id" className="max-w-sm mb-6">
          <div className="flex justify-start items-center gap-x-6">
            <Form.Control
              required
              type="text"
              placeholder="Masukkan ID Soal..."
              autoComplete="off"
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

      <Tab eventKey="preview" title="Preview"></Tab>
    </Tabs>
  );
}
