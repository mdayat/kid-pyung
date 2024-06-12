import { useState } from "react";
import Quill from "quill";
import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import type { Dispatch, FormEvent, SetStateAction } from "react";

import { RichTextEditor } from "../components/RichTextEditor";

export function Soal(): JSX.Element {
  const [soalQuill, setSoalQuill] = useState<Quill>();
  function submitCreateSoal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(soalQuill);
  }

  function checkIDSoal() {}

  return (
    <Accordion as={Form} onSubmit={submitCreateSoal} action="">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Soal</Accordion.Header>
        <Accordion.Body
          as={Form.Group}
          controlId="soal_id"
          className="max-w-sm"
        >
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
        </Accordion.Body>

        <Accordion.Body as={Form.Group}>
          <Form.Label as="p">Teks Editor Soal</Form.Label>
          <RichTextEditor
            setEditorInstance={setSoalQuill as Dispatch<SetStateAction<Quill>>}
            editorID="soal_editor"
            toolbarID="soal_toolbar"
          />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}
